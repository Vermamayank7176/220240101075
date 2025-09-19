import './App.css'
import React, { useState, useEffect } from 'react';

// Logging Middleware Implementation (Required by documentation)
const LoggingMiddleware = {
  log: function(stack, level, packageName, message) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      stack,
      level: level.toLowerCase(),
      package: packageName,
      message
    };
    
    console.log(`[${timestamp}] ${level.toUpperCase()} [${stack}/${packageName}] ${message}`);
    
    // Store logs in memory (in production, would POST to server)
    const logs = JSON.parse(sessionStorage.getItem('appLogs') || '[]');
    logs.push(logData);
    if (logs.length > 100) logs.shift();
    sessionStorage.setItem('appLogs', JSON.stringify(logs));
  }
};

// API Service
const ApiService = {
  baseURL: 'http://20.244.56.144/evaluation-service',
  
  shortenURL: async function(urlData) {
    LoggingMiddleware.log('frontend', 'info', 'url', `Shortening URL: ${urlData.url}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const shortCode = urlData.customCode || this.generateShortCode();
        const result = {
          id: Date.now() + Math.random(),
          originalUrl: urlData.url,
          shortCode: shortCode,
          shortUrl: `${window.location.origin}/${shortCode}`,
          validityMinutes: urlData.validity || 30,
          expiresAt: new Date(Date.now() + (urlData.validity || 30) * 60000),
          createdAt: new Date(),
          clickCount: 0,
          clicks: []
        };
        LoggingMiddleware.log('frontend', 'info', 'url', `URL shortened successfully: ${shortCode}`);
        resolve(result);
      }, 1000);
    });
  },
  
  generateShortCode: function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// URL Shortener Page Component
const URLShortenerPage = ({ onURLShortened, existingURLs }) => {
  const [formData, setFormData] = useState({
    url: '',
    validity: 30,
    customCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateURL = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateCustomCode = (code) => {
    if (!code) return true;
    const regex = /^[a-zA-Z0-9]{3,15}$/;
    return regex.test(code);
  };

  const isCodeUnique = (code) => {
    return !existingURLs.some(url => url.shortCode.toLowerCase() === code.toLowerCase());
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.url.trim()) {
      setError('Please enter a URL to shorten');
      LoggingMiddleware.log('frontend', 'warn', 'validation', 'Empty URL submitted');
      return;
    }

    if (!validateURL(formData.url)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      LoggingMiddleware.log('frontend', 'warn', 'validation', 'Invalid URL format');
      return;
    }

    if (!validateCustomCode(formData.customCode)) {
      setError('Custom code must be 3-15 alphanumeric characters only');
      LoggingMiddleware.log('frontend', 'warn', 'validation', 'Invalid custom code format');
      return;
    }

    if (formData.customCode && !isCodeUnique(formData.customCode)) {
      setError('This custom code is already taken. Please choose another.');
      LoggingMiddleware.log('frontend', 'warn', 'validation', 'Custom code collision detected');
      return;
    }

    if (formData.validity < 1 || formData.validity > 10080) {
      setError('Validity must be between 1 and 10,080 minutes (1 week)');
      LoggingMiddleware.log('frontend', 'warn', 'validation', 'Invalid validity period');
      return;
    }

    if (existingURLs.length >= 5) {
      setError('Maximum of 5 concurrent URLs allowed');
      LoggingMiddleware.log('frontend', 'warn', 'validation', 'URL limit reached');
      return;
    }

    setLoading(true);
    
    try {
      const result = await ApiService.shortenURL({
        url: formData.url,
        validity: formData.validity,
        customCode: formData.customCode
      });

      setSuccess(`Success! Your short URL: ${result.shortUrl}`);
      onURLShortened(result);
      setFormData({ url: '', validity: 30, customCode: '' });
      
      LoggingMiddleware.log('frontend', 'info', 'url', 'URL creation completed successfully');
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      LoggingMiddleware.log('frontend', 'error', 'url', `URL shortening error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    header: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '3rem 2rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      margin: 0
    },
    subtitle: {
      fontSize: '1.125rem',
      opacity: '0.9',
      margin: 0
    },
    content: {
      padding: '2.5rem'
    },
    inputGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.875rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#4facfe',
      outline: 'none'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    alert: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.5rem'
    },
    errorAlert: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    successAlert: {
      background: '#f0fdf4',
      color: '#16a34a',
      border: '1px solid #bbf7d0'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '8px',
      fontSize: '1.125rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    buttonDisabled: {
      background: '#9ca3af',
      cursor: 'not-allowed'
    },
    helpText: {
      display: 'block',
      marginTop: '0.25rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>URL Shortener</h1>
          <p style={styles.subtitle}>Transform long URLs into short, shareable links</p>
        </div>
        
        <div style={styles.content}>
          <div style={styles.inputGroup}>
            <label htmlFor="url" style={styles.label}>Long URL *</label>
            <input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://example.com/your-very-long-url-here"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label htmlFor="validity" style={styles.label}>Validity (minutes)</label>
              <input
                id="validity"
                type="number"
                value={formData.validity}
                onChange={(e) => handleInputChange('validity', parseInt(e.target.value) || 30)}
                min="1"
                max="10080"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="customCode" style={styles.label}>Custom Code (optional)</label>
              <input
                id="customCode"
                type="text"
                value={formData.customCode}
                onChange={(e) => handleInputChange('customCode', e.target.value)}
                placeholder="my-link"
                style={styles.input}
                maxLength="15"
              />
              <small style={styles.helpText}>3-15 alphanumeric characters</small>
            </div>
          </div>

          {error && (
            <div style={{...styles.alert, ...styles.errorAlert}}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div style={{...styles.alert, ...styles.successAlert}}>
              <span>✅</span>
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || existingURLs.length >= 5}
            style={{
              ...styles.button,
              ...(loading || existingURLs.length >= 5 ? styles.buttonDisabled : {})
            }}
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>

          {existingURLs.length >= 5 && (
            <div style={{
              textAlign: 'center',
              color: '#dc2626',
              background: '#fef2f2',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              fontWeight: '500'
            }}>
              You've reached the maximum of 5 concurrent URLs. View your statistics to manage existing links.
            </div>
          )}

          {existingURLs.length > 0 && (
            <div style={{
              borderTop: '2px solid #f3f4f6',
              paddingTop: '2rem',
              marginTop: '2rem'
            }}>
              <h3 style={{
                color: '#374151',
                marginBottom: '1rem',
                fontSize: '1.25rem'
              }}>Recently Created</h3>
              {existingURLs.slice(-3).map(url => (
                <div key={url.id} style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <strong>{url.shortUrl}</strong>
                    <button 
                      onClick={() => navigator.clipboard.writeText(url.shortUrl)}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    wordBreak: 'break-all',
                    marginBottom: '0.5rem'
                  }}>
                    {url.originalUrl}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af'
                  }}>
                    Expires: {url.expiresAt.toLocaleString()} • Clicks: {url.clickCount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Statistics Page Component
const StatisticsPage = ({ urls }) => {
  const generateMockLocation = () => {
    const locations = [
      'New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia',
      'Mumbai, India', 'Berlin, Germany', 'São Paulo, Brazil', 'Toronto, Canada'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const generateMockSource = () => {
    const sources = ['Direct', 'Google Search', 'Facebook', 'Twitter', 'LinkedIn', 'WhatsApp', 'Email'];
    return sources[Math.floor(Math.random() * sources.length)];
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
  const activeUrls = urls.filter(url => new Date() < url.expiresAt).length;

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    header: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '3rem 2rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      margin: 0
    },
    subtitle: {
      fontSize: '1.125rem',
      opacity: '0.9',
      margin: 0
    },
    content: {
      padding: '2.5rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#6b7280'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    overviewStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '12px',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      opacity: '0.9',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    urlDetailCard: {
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    urlExpired: {
      background: '#fef7f7',
      borderColor: '#fecaca',
      opacity: '0.8'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>URL Statistics</h1>
          <p style={styles.subtitle}>Comprehensive analytics for your shortened URLs</p>
        </div>
        
        <div style={styles.content}>
          {urls.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📊</div>
              <h3>No URLs to analyze yet</h3>
              <p>Create your first shortened URL to see detailed statistics here.</p>
            </div>
          ) : (
            <div>
              <div style={styles.overviewStats}>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{urls.length}</div>
                  <div style={styles.statLabel}>Total URLs</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{totalClicks}</div>
                  <div style={styles.statLabel}>Total Clicks</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statNumber}>{activeUrls}</div>
                  <div style={styles.statLabel}>Active URLs</div>
                </div>
              </div>

              <h3 style={{
                color: '#374151',
                marginBottom: '1.5rem',
                fontSize: '1.5rem'
              }}>URL Details</h3>

              {urls.map(url => {
                const isExpired = new Date() > url.expiresAt;
                const clickRate = url.clickCount / Math.max(1, 
                  Math.floor((Date.now() - url.createdAt.getTime()) / 3600000)
                );

                return (
                  <div key={url.id} style={{
                    ...styles.urlDetailCard,
                    ...(isExpired ? styles.urlExpired : {})
                  }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem'
                      }}>
                        <h4 style={{
                          color: '#2563eb',
                          fontSize: '1.125rem',
                          margin: 0
                        }}>
                          {url.shortUrl}
                        </h4>
                        {isExpired && (
                          <span style={{
                            background: '#fecaca',
                            color: '#dc2626',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            Expired
                          </span>
                        )}
                      </div>
                      <div style={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        wordBreak: 'break-all',
                        marginBottom: '0.75rem'
                      }}>
                        <strong>Original:</strong> {url.originalUrl}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        fontSize: '0.875rem',
                        color: '#9ca3af'
                      }}>
                        <span>Created: {url.createdAt.toLocaleString()}</span>
                        <span>Expires: {url.expiresAt.toLocaleString()}</span>
                      </div>
                    </div>

                    <div style={{
                      background: '#f9fafb',
                      padding: '1.5rem',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: '2rem',
                        marginBottom: '1.5rem'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: '#2563eb',
                            marginBottom: '0.25rem'
                          }}>
                            {url.clickCount}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Total Clicks
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: '#2563eb',
                            marginBottom: '0.25rem'
                          }}>
                            {clickRate.toFixed(1)}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Clicks/Hour
                          </div>
                        </div>
                      </div>

                      {url.clicks && url.clicks.length > 0 && (
                        <div>
                          <h5 style={{
                            color: '#374151',
                            marginBottom: '1rem'
                          }}>Recent Click Activity</h5>
                          <div style={{
                            maxHeight: '300px',
                            overflowY: 'auto'
                          }}>
                            {url.clicks.slice(-8).reverse().map((click, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                padding: '0.75rem',
                                marginBottom: '0.5rem'
                              }}>
                                <div style={{
                                  fontWeight: '500',
                                  color: '#374151',
                                  fontSize: '0.875rem'
                                }}>
                                  {click.timestamp.toLocaleString()}
                                </div>
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-end',
                                  gap: '0.25rem'
                                }}>
                                  <div style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280'
                                  }}>
                                    Source: {click.source || generateMockSource()}
                                  </div>
                                  <div style={{
                                    fontSize: '0.75rem',
                                    color: '#6b7280'
                                  }}>
                                    Location: {click.location || generateMockLocation()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ currentPage, onPageChange }) => {
  const styles = {
    nav: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    brand: {
      textAlign: 'left'
    },
    brandTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      marginBottom: '0.25rem',
      margin: 0
    },
    brandSubtitle: {
      fontSize: '0.875rem',
      opacity: '0.9',
      fontStyle: 'italic',
      margin: 0
    },
    buttons: {
      display: 'flex',
      gap: '1rem'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    buttonActive: {
      background: 'white',
      color: '#667eea',
      fontWeight: '600'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.content}>
        <div style={styles.brand}>
          <h2 style={styles.brandTitle}>AFFORDMED</h2>
          <p style={styles.brandSubtitle}>Technology, Innovation & Affordability</p>
        </div>
        <div style={styles.buttons}>
          <button 
            style={{
              ...styles.button,
              ...(currentPage === 'shortener' ? styles.buttonActive : {})
            }}
            onClick={() => onPageChange('shortener')}
          >
            Shorten URL
          </button>
          <button 
            style={{
              ...styles.button,
              ...(currentPage === 'statistics' ? styles.buttonActive : {})
            }}
            onClick={() => onPageChange('statistics')}
          >
            Statistics
          </button>
        </div>
      </div>
    </nav>
  );
};

// Main Application Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('shortener');
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    LoggingMiddleware.log('frontend', 'info', 'app', 'Application initialized successfully');
  }, []);

  const handleURLShortened = (newURL) => {
    setUrls(prev => {
      const updated = [newURL, ...prev];
      LoggingMiddleware.log('frontend', 'info', 'storage', `URL added. Total count: ${updated.length}`);
      return updated;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    LoggingMiddleware.log('frontend', 'info', 'navigation', `Navigation to page: ${page}`);
  };

  const appStyles = {
    app: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      backgroundColor: '#f8fafc',
      lineHeight: '1.6',
      color: '#1a202c'
    },
    main: {
      flex: 1,
      padding: '2rem 1rem'
    },
    footer: {
      background: '#1f2937',
      color: '#d1d5db',
      padding: '2rem 0',
      textAlign: 'center',
      marginTop: 'auto'
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem'
    },
    footerText: {
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      margin: '0 0 0.5rem 0'
    }
  };

  return (
    <div style={appStyles.app}>
      <Navigation 
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      
      <main style={appStyles.main}>
        {currentPage === 'shortener' && (
          <URLShortenerPage 
            onURLShortened={handleURLShortened}
            existingURLs={urls}
          />
        )}
        
        {currentPage === 'statistics' && (
          <StatisticsPage urls={urls} />
        )}
      </main>
      
      <footer style={appStyles.footer}>
        <div style={appStyles.footerContent}>
          <p style={appStyles.footerText}>© 2024 Afford Medical Technologies Private Limited</p>
          <p style={appStyles.footerText}>B 230 2nd Main Road, Sainikpuri, Hyderabad-500094, Telangana, INDIA</p>
        </div>
      </footer>
    </div>
  );
};

export default App;