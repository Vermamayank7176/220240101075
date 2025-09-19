# URL Shortener Web Application

A React-based URL shortener application with comprehensive analytics and logging integration, developed for the Affordmed Campus Hiring Evaluation.

## Project Overview

This application provides core URL shortening functionality with detailed analytics, built to meet specific technical requirements including mandatory logging middleware integration, client-side validation, and comprehensive click tracking.

## Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, manageable links
- **Custom Shortcodes**: Optional user-defined shortcodes with validation
- **Expiration Management**: Configurable validity periods (default: 30 minutes)
- **Click Tracking**: Detailed analytics with timestamps and source tracking
- **URL Uniqueness**: Automatic generation of unique shortcodes
- **Client-side Validation**: Comprehensive input validation before API calls

### User Interface
- **Responsive Design**: Optimized for desktop usage
- **Material Design**: Clean, modern interface using Tailwind CSS
- **Two Main Views**: URL Shortener and Statistics pages
- **Real-time Feedback**: Copy-to-clipboard, loading states, error messages
- **Visual Indicators**: Active/expired status, click counts, time remaining

### Technical Implementation
- **Logging Middleware**: Extensive logging integration throughout the application
- **Authentication Ready**: Pre-configured with API credentials structure
- **Error Handling**: Robust client-side error handling and user feedback
- **State Management**: React hooks for efficient state management

## Technology Stack

- **Frontend**: React 18+ with Hooks
- **Styling**: Tailwind CSS (core utilities only)
- **Icons**: Lucide React
- **Build Tool**: Modern React development environment
- **API Integration**: RESTful API calls with proper error handling

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd url-shortener-app

# Install dependencies
npm install

# Start development server
npm start

# Application will run on http://localhost:3000
```

### Production Build
```bash
# Create optimized production build
npm run build

# Serve production build locally (optional)
npm run serve
```

## API Integration

The application is designed to integrate with the following API endpoints:

### Authentication
- **POST** `http://20.244.56.144/evaluation-service/auth`
- **POST** `http://20.244.56.144/evaluation-service/register`

### Logging Service
- **POST** `http://20.244.56.144/evaluation-service/logs`

### Request Structure
```json
{
  "stack": "frontend",
  "level": "info",
  "package": "component", 
  "message": "User action description"
}
```

## Application Architecture

### Component Structure
```
URLShortener/
├── Main Application Component
├── URL Creation Form
├── URL Management Interface
├── Statistics Dashboard
├── Logging Middleware
└── Utility Functions
```

### State Management
- **URLs Array**: Stores all created shortened URLs
- **Form Data**: Manages input form state
- **UI State**: Loading states, errors, current page
- **Analytics Data**: Click tracking and statistics

### Logging Integration
The application implements comprehensive logging throughout:
- **User Actions**: Form submissions, clicks, navigation
- **API Calls**: Request initiation and responses
- **Validation Events**: Client-side validation results
- **Error Handling**: All error conditions and recoveries
- **System Events**: Application initialization and state changes

## Usage Guide

### Creating Short URLs
1. Navigate to the URL Shortener page
2. Enter the original URL (must include http:// or https://)
3. Optionally specify a custom shortcode (alphanumeric, hyphens, underscores)
4. Set validity period in minutes (default: 30, max: 525600)
5. Click "Create Short URL"

### Managing URLs
- **Copy**: Click the copy icon to copy short URL to clipboard
- **Open**: Click the external link icon to open original URL
- **Delete**: Click the trash icon to remove the URL
- **View Stats**: Switch to Statistics page for detailed analytics

### Analytics Dashboard
- **Overview Metrics**: Total URLs, clicks, active URLs, average clicks
- **Individual URL Stats**: Creation dates, expiry times, click history
- **Click Details**: Timestamps, sources, geographical locations

## Configuration

### Default Settings
```javascript
const defaultConfig = {
  validityMinutes: 30,        // Default URL validity
  shortcodeLength: 6,         // Auto-generated shortcode length
  maxCustomLength: 20,        // Maximum custom shortcode length
  maxValidityMinutes: 525600  // Maximum validity (1 year)
};
```

### API Credentials Structure
```javascript
const authCredentials = {
  email: "user@domain.edu",
  name: "Full Name",
  rollNo: "studentId",
  accessCode: "providedCode",
  clientID: "uuid-string",
  clientSecret: "secretKey"
};
```

## Validation Rules

### URL Validation
- Must be valid URL format
- Must include protocol (http:// or https://)
- Cannot be empty

### Custom Shortcode Validation
- Alphanumeric characters, hyphens, underscores only
- Maximum 20 characters
- Must be unique across all URLs
- Optional field

### Validity Period
- Minimum: 1 minute
- Maximum: 525,600 minutes (1 year)
- Default: 30 minutes
- Must be positive integer

## Error Handling

The application implements comprehensive error handling:
- **Client-side Validation**: Pre-submission input validation
- **API Error Responses**: Graceful handling of server errors
- **Network Issues**: Connection timeout and retry logic
- **User Feedback**: Clear error messages with resolution guidance
- **Logging Integration**: All errors logged for debugging

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

- **Input Sanitization**: All user inputs validated and sanitized
- **URL Validation**: Prevents malicious URL submission
- **No Local Storage**: All data stored in memory for security
- **HTTPS Ready**: Designed for secure production deployment

## Performance Optimizations

- **React Hooks**: Efficient state management and re-rendering
- **Lazy Loading**: Components loaded as needed
- **Optimized Builds**: Production builds with code splitting
- **Memory Management**: Proper cleanup of event listeners

## Development Guidelines

### Code Style
- ES6+ JavaScript features
- Functional components with hooks
- Consistent naming conventions
- Comprehensive error handling
- Extensive logging integration

### Testing Approach
- Component functionality testing
- User interaction testing
- API integration testing
- Error condition testing
- Cross-browser compatibility testing

## Deployment

### Environment Variables
```bash
REACT_APP_API_BASE_URL=http://20.244.56.144
REACT_APP_LOG_LEVEL=info
REACT_APP_MAX_URLS=100
```

### Production Considerations
- Enable HTTPS for secure communication
- Configure proper CORS settings
- Set up proper error monitoring
- Implement rate limiting
- Configure backup and recovery

## Troubleshooting

### Common Issues
- **API Connection Errors**: Check network connectivity and API endpoint availability
- **Validation Errors**: Ensure all required fields meet validation criteria
- **Shortcode Conflicts**: Use auto-generation if custom codes are taken
- **Expired URLs**: Check expiration times and create new URLs as needed

### Debug Mode
Enable detailed logging by setting log level to 'debug' in the application configuration.

## Contributing

This project was developed for the Affordmed Campus Hiring Evaluation. For questions or issues related to the evaluation process, please contact the technical team.

## License

This project is developed for educational and evaluation purposes as part of the Affordmed Campus Hiring process.

## Company Information

**Affordmed Technologies Private Limited**
- Address: B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA
- Phone: 91-40-27170628/27116133
- Website: www.affordmed.com
- Email: contact@affordmed.com

---

*URL Shortener Application - Campus Hiring Evaluation*
*Technology, Innovation & Affordability*