import axios from 'axios';
import * as cheerio from 'cheerio';
import pdfParse from 'pdf-parse';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// SSRF Protection: Block private IP ranges and internal network addresses
function isSafeUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    
    // Check localhost & metadata endpoints
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '169.254.169.254'
    ) {
      return false;
    }

    // Check private RFC 1918 ranges
    if (
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const extractionService = {
  // Generate SHA-256 hash of extracted text
  generateHash(text) {
    return crypto.createHash('sha256').update(text.trim()).digest('hex');
  },

  // Extract from Live URL
  async extractFromUrl(url) {
    if (!isSafeUrl(url)) {
      const error = new Error('The target URL is invalid or points to an internal restricted network.');
      error.statusCode = 400;
      error.code = 'INVALID_OR_RESTRICTED_URL';
      throw error;
    }

    logger.info(`Fetching policy document from URL: ${url}`);

    let response;
    try {
      response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 PrivyLensAI/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 15000,
        maxContentLength: 10 * 1024 * 1024, // 10MB
      });
    } catch (err) {
      const error = new Error(`Unable to fetch policy webpage: ${err.message}`);
      error.statusCode = 502;
      error.code = 'FETCH_FAILED';
      throw error;
    }

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract title
    let title = $('h1').first().text().trim() || $('title').text().trim() || 'Privacy Policy';
    title = title.replace(/\s+/g, ' ').substring(0, 150);

    // Strip noise, navigation, scripts, footers, and cookie banners
    $(
      'script, style, noscript, nav, footer, header, aside, svg, iframe, form, button, input, [role="navigation"], [role="banner"], [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i]'
    ).remove();

    // Prioritize main content containers if available
    let contentContainer = $('main, article, [role="main"], .privacy-policy, .legal-content, #privacy-policy, .entry-content');
    if (!contentContainer.length) {
      contentContainer = $('body');
    }

    // Extract clean paragraphs and headers
    const extractedBlocks = [];
    contentContainer.find('h1, h2, h3, h4, h5, h6, p, li').each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 15) {
        extractedBlocks.push(text);
      }
    });

    const fullText = extractedBlocks.join('\n\n');

    if (fullText.length < 100) {
      const error = new Error('Insufficient textual content found. The page might require JavaScript or login.');
      error.statusCode = 422;
      error.code = 'INSUFFICIENT_CONTENT';
      throw error;
    }

    const contentHash = this.generateHash(fullText);
    const sections = this.segmentText(fullText);

    return {
      title,
      websiteUrl: new URL(url).origin,
      policyUrl: url,
      extractedText: fullText,
      contentHash,
      sections,
      sourceType: 'url',
    };
  },

  // Extract from Raw PDF Buffer
  async extractFromPdf(buffer, filename = 'Uploaded Policy') {
    logger.info(`Extracting text from PDF policy (${buffer.length} bytes)...`);
    let data;
    try {
      data = await pdfParse(buffer);
    } catch (err) {
      const error = new Error(`Failed to parse PDF document: ${err.message}`);
      error.statusCode = 400;
      error.code = 'PDF_PARSE_ERROR';
      throw error;
    }

    const fullText = data.text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
    if (fullText.length < 100) {
      const error = new Error('The PDF document contains insufficient text or appears to be a scanned image.');
      error.statusCode = 422;
      error.code = 'INSUFFICIENT_CONTENT';
      throw error;
    }

    const contentHash = this.generateHash(fullText);
    const sections = this.segmentText(fullText);

    return {
      title: filename.replace(/\.pdf$/i, '') || 'Privacy Policy Document',
      websiteUrl: '',
      policyUrl: filename,
      extractedText: fullText,
      contentHash,
      sections,
      sourceType: 'pdf',
    };
  },

  // Extract from Raw Text input
  extractFromText(text, title = 'Custom Privacy Policy') {
    const cleaned = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
    if (cleaned.length < 50) {
      const error = new Error('Policy text is too short to analyze.');
      error.statusCode = 400;
      error.code = 'TEXT_TOO_SHORT';
      throw error;
    }

    const contentHash = this.generateHash(cleaned);
    const sections = this.segmentText(cleaned);

    return {
      title,
      websiteUrl: '',
      policyUrl: 'Direct Submission',
      extractedText: cleaned,
      contentHash,
      sections,
      sourceType: 'manual',
    };
  },

  // Segment text into logical sections for RAG & Scoring
  segmentText(text) {
    const paragraphs = text.split(/\n\n+/);
    const sections = [];
    let currentSection = {
      title: 'General Overview',
      content: [],
    };

    const sectionRegex = /^(section|\d+[\.\)]|[A-Z\s]{4,}:|[IVXLCDM]+\.)/i;

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      if (trimmed.length < 80 && (sectionRegex.test(trimmed) || trimmed.endsWith(':'))) {
        if (currentSection.content.length > 0) {
          sections.push({
            title: currentSection.title,
            content: currentSection.content.join('\n\n'),
          });
        }
        currentSection = {
          title: trimmed,
          content: [],
        };
      } else {
        currentSection.content.push(trimmed);
      }
    }

    if (currentSection.content.length > 0) {
      sections.push({
        title: currentSection.title,
        content: currentSection.content.join('\n\n'),
      });
    }

    return sections;
  },
};

export default extractionService;
