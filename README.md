# GenAI-Scout Lite

A simplified technology scouting assistant powered by generative AI. This application helps small to mid-sized enterprises and innovation teams quickly gather curated technology intelligence.

## Features

### Core Functionality
- **Topic Analysis**: Input any technology topic and get comprehensive AI-powered analysis
- **Document Upload**: Upload PDFs, DOCs, or text files for technology insights extraction
- **URL Analysis**: Analyze web pages and articles for technology intelligence
- **AI-Assisted Editing**: Refine, simplify, or expand any section with AI assistance

### Export & Sharing
- **PDF Export**: Generate professional one-page reports
- **Markdown Export**: Download analysis in Markdown format
- **Shareable Links**: Create read-only links to share your analysis
- **No-Login Required**: Immediate access without user registration

### Advanced UI
- Modern, responsive design built with Tailwind CSS
- Professional aesthetics suitable for business presentations
- Intuitive navigation and clear call-to-action buttons
- Accessible and mobile-friendly interface

## Technology Stack

- **Frontend**: Next.js 15 with React and TypeScript
- **Styling**: Tailwind CSS for modern UI design
- **AI Integration**: Groq API with Llama3-8b model
- **File Handling**: React Dropzone for uploads
- **Export**: jsPDF for PDF generation
- **Icons**: Lucide React for consistent iconography

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xorjun/genai-scout-lite.git
cd genai-scout-lite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_APP_NAME=GenAI-Scout Lite
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Analyzing a Technology Topic
1. Enter a technology topic in the text area (e.g., "Digital Twins", "Quantum Computing")
2. Click "Analyze Topic" to generate comprehensive insights
3. Review the generated sections: Overview, Market Trends, Key Players, Use Cases, and Challenges

### Uploading Documents
1. Drag and drop a file or click to browse
2. Supported formats: PDF, DOC, DOCX, TXT (up to 10MB)
3. Click "Analyze Document" to extract technology insights

### Analyzing URLs
1. Paste a URL in the URL input field
2. Click "Analyze" to extract technology information from the webpage

### Editing Results
- Click the edit icon on any section to modify content manually
- Use "Refine", "Simplify", or "Expand" buttons for AI-assisted improvements
- Save changes or cancel to revert

### Exporting Results
- **PDF**: Download a formatted PDF report
- **Markdown**: Get a Markdown file for documentation
- **Share**: Create a shareable link for read-only access

## API Endpoints

- `POST /api/analyze-topic` - Analyze a technology topic
- `POST /api/analyze-file` - Extract insights from uploaded files
- `POST /api/analyze-url` - Analyze web page content
- `POST /api/refine-content` - AI-assisted content refinement
- `POST /api/create-share-link` - Generate shareable links

## Configuration

### Groq API Setup
1. Sign up for a Groq account at [https://groq.com](https://groq.com)
2. Generate an API key from your dashboard
3. Add the API key to your `.env.local` file

### Customization
- Modify prompts in API route files to adjust analysis style
- Update UI components in `/src/components/` for design changes
- Adjust Tailwind classes for styling modifications

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. **Fork this repository** on GitHub
2. **Sign up for Vercel** at [vercel.com](https://vercel.com)
3. **Connect your GitHub account** to Vercel
4. **Import your repository** and Vercel will auto-detect Next.js
5. **Add environment variables**:
   - `GROQ_API_KEY`: Your Groq API key
6. **Deploy** - Vercel will automatically build and deploy

#### Manual Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add GROQ_API_KEY
```

### Alternative: AWS EC2 Deployment

For AWS EC2 deployment, see the comprehensive [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions on:
- Setting up Ubuntu EC2 server
- Configuring Nginx and SSL
- Process management with PM2
- Monitoring and maintenance

### Quick Commands Reference

For experienced users, see [Quick Reference](./QUICK_REFERENCE.md) for essential commands.

## File Structure

```
genai-scout-lite/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── share/            # Shared analysis pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   └── components/
│       ├── TechScoutApp.tsx  # Main application component
│       ├── TopicInput.tsx    # Topic input form
│       ├── FileUpload.tsx    # File upload component
│       ├── AnalysisResults.tsx # Results display
│       └── ExportOptions.tsx # Export functionality
├── public/                   # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment
├── DEPLOYMENT_GUIDE.md       # Comprehensive deployment guide
├── QUICK_REFERENCE.md        # Quick command reference
└── README.md                 # This file
```

## Environment Variables

Required environment variables:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional
NEXT_PUBLIC_APP_NAME=GenAI-Scout Lite
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Troubleshooting

Common issues and solutions:

### Build Errors
- Ensure Node.js version is 18+
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### API Issues
- Verify GROQ_API_KEY is correctly set
- Check API key permissions and quota

### Deployment Issues
- Refer to the [Deployment Guide](./DEPLOYMENT_GUIDE.md) troubleshooting section
- Check server logs: `pm2 logs` or `sudo tail -f /var/log/nginx/error.log`

## Security Notes

- Keep your GROQ API key secure and never commit it to version control
- Use environment variables for all sensitive configuration
- Regularly update dependencies: `npm audit fix`
- For production deployment, follow security best practices in the deployment guide

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for deployment issues
- Review the [Quick Reference](./QUICK_REFERENCE.md) for common commands

## Acknowledgments

- Powered by Groq AI for fast and reliable language model inference
- Built with Next.js and React for modern web development
- Styled with Tailwind CSS for professional design
- Icons provided by Lucide React
