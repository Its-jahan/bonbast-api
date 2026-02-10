# Design Document: Frontend Refinement

## Overview

This design document outlines the technical approach for refining the React + Vite + Tailwind CSS application with three major enhancements: IranyekanX font integration, dark/light theme switching, and an API Manager feature.

### Current Architecture

The application is built with:
- **React 19.2.0**: Component-based UI framework
- **Vite 7.3.1**: Fast build tool and dev server
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **Axios 1.13.5**: HTTP client for API requests
- **RTL Support**: Right-to-left layout for Persian content

The current implementation consists of a single `App.jsx` component that fetches market prices from `/api/prices` every 60 seconds and displays them in a grid layout with hardcoded dark theme colors.

### Design Approach

The refinement will follow these principles:

1. **Minimal Disruption**: Preserve existing functionality while adding new features
2. **Component Modularity**: Extract reusable components from the monolithic App.jsx
3. **Context-Based State**: Use React Context for theme and API manager state
4. **CSS Variables**: Leverage Tailwind CSS with CSS custom properties for dynamic theming
5. **Progressive Enhancement**: Load fonts and features without blocking initial render
6. **Type Safety**: Add PropTypes or TypeScript interfaces for component props

## Architecture

### Component Hierarchy

```
App
├── ThemeProvider (Context)
│   └── ThemeContext
├── Layout
│   ├── Header
│   │   ├── Logo/Title
│   │   ├── Navigation
│   │   └── ThemeToggle
│   └── Main Content
│       ├── PriceDisplay (existing, refactored)
│       └── APIManager (new)
│           ├── APIProductList
│           │   ├── APIProductCard
│           │   └── SearchFilter
│           ├── APIProductDetail
│           │   └── PurchaseForm
│           └── APIKeyDashboard
│               └── APIKeyCard
```

### State Management

**Theme State** (React Context):
- Current theme mode (dark | light)
- Theme toggle function
- Persistence to localStorage

**API Manager State** (React Context or Component State):
- Available API products
- User's purchased products
- API keys and usage statistics
- Purchase flow state

**Price Data State** (Existing, in App component):
- Current prices
- Last updated timestamp
- Loading and error states

### Routing Strategy

Since the application is currently single-page, we'll implement client-side routing using React Router:

- `/` - Price Display (home)
- `/api-manager` - API Manager landing page
- `/api-manager/products` - Browse API products
- `/api-manager/products/:id` - Product detail and purchase
- `/api-manager/dashboard` - User's API keys and usage

## Components and Interfaces

### 1. ThemeProvider Component

**Purpose**: Manages theme state and provides theme context to all components.

**Interface**:
```typescript
interface ThemeContextValue {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}
```

**Implementation Details**:
- Uses `useState` to manage current theme
- Uses `useEffect` to load theme from localStorage on mount
- Uses `useEffect` to save theme to localStorage on change
- Applies theme class to document root element
- Provides context value to children

**Pseudocode**:
```
function ThemeProvider(props):
  // Initialize theme from localStorage or default to 'dark'
  theme = useState(loadThemeFromStorage() || 'dark')
  
  // Load theme on mount
  useEffect(() => {
    savedTheme = localStorage.getItem('theme')
    if savedTheme exists:
      setTheme(savedTheme)
  }, [])
  
  // Save theme on change and apply to document
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])
  
  toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  
  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {props.children}
    </ThemeContext.Provider>
  )
```

### 2. ThemeToggle Component

**Purpose**: Provides UI control for switching themes.

**Interface**:
```typescript
interface ThemeToggleProps {
  className?: string;
}
```

**Implementation Details**:
- Consumes ThemeContext
- Renders a button with sun/moon icon
- Calls toggleTheme on click
- Includes ARIA labels for accessibility
- Animated transition between icons

**Pseudocode**:
```
function ThemeToggle(props):
  {theme, toggleTheme} = useContext(ThemeContext)
  
  icon = theme === 'dark' ? <SunIcon /> : <MoonIcon />
  ariaLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  
  return (
    <button 
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={props.className}
    >
      {icon}
    </button>
  )
```

### 3. PriceDisplay Component (Refactored)

**Purpose**: Displays real-time market prices in a grid layout.

**Interface**:
```typescript
interface Price {
  [key: string]: string | number;
}

interface PriceDisplayProps {
  prices: Price;
  lastUpdated: string;
  loading: boolean;
  error: string | null;
}
```

**Implementation Details**:
- Extracted from App.jsx
- Receives prices as props
- Uses theme-aware Tailwind classes
- Maintains existing grid layout and styling
- Applies IranyekanX font to Persian text

### 4. APIProductCard Component

**Purpose**: Displays a single API product in the product list.

**Interface**:
```typescript
interface APIProduct {
  id: string;
  name: string;
  nameFA: string;
  description: string;
  descriptionFA: string;
  category: string;
  price: number;
  currency: string;
  rateLimit: string;
  features: string[];
}

interface APIProductCardProps {
  product: APIProduct;
  onSelect: (productId: string) => void;
}
```

**Implementation Details**:
- Displays product name (Persian), description, price
- Shows rate limits and key features
- Click handler to navigate to product detail
- Theme-aware styling
- Hover effects for interactivity

**Pseudocode**:
```
function APIProductCard({product, onSelect}):
  handleClick = () => {
    onSelect(product.id)
  }
  
  return (
    <div onClick={handleClick} className="card theme-card">
      <h3>{product.nameFA}</h3>
      <p>{product.descriptionFA}</p>
      <div className="price">{product.price} {product.currency}</div>
      <div className="rate-limit">{product.rateLimit}</div>
      <ul>
        {product.features.map(feature => <li>{feature}</li>)}
      </ul>
    </div>
  )
```

### 5. APIProductList Component

**Purpose**: Displays all available API products with search/filter.

**Interface**:
```typescript
interface APIProductListProps {
  products: APIProduct[];
  onProductSelect: (productId: string) => void;
}
```

**Implementation Details**:
- Manages search query state
- Filters products based on search
- Groups products by category
- Renders APIProductCard for each product
- Responsive grid layout

**Pseudocode**:
```
function APIProductList({products, onProductSelect}):
  searchQuery = useState('')
  
  filteredProducts = products.filter(product => {
    return product.nameFA.includes(searchQuery) ||
           product.category.includes(searchQuery)
  })
  
  groupedProducts = groupByCategory(filteredProducts)
  
  return (
    <div>
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      {Object.entries(groupedProducts).map(([category, items]) => (
        <section key={category}>
          <h2>{category}</h2>
          <div className="grid">
            {items.map(product => (
              <APIProductCard 
                key={product.id}
                product={product}
                onSelect={onProductSelect}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
```

### 6. PurchaseForm Component

**Purpose**: Handles the API product purchase flow.

**Interface**:
```typescript
interface PurchaseFormProps {
  product: APIProduct;
  onSuccess: (apiKey: string) => void;
  onCancel: () => void;
}
```

**Implementation Details**:
- Collects user email and payment information
- Validates form inputs
- Submits purchase request to backend
- Handles loading, success, and error states
- Displays generated API key on success

**Pseudocode**:
```
function PurchaseForm({product, onSuccess, onCancel}):
  formData = useState({email: '', paymentMethod: ''})
  loading = useState(false)
  error = useState(null)
  
  handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    try:
      response = await axios.post('/api/purchase', {
        productId: product.id,
        email: formData.email,
        paymentMethod: formData.paymentMethod
      })
      
      if response.data.success:
        onSuccess(response.data.apiKey)
      else:
        setError(response.data.message)
    catch (err):
      setError('Purchase failed. Please try again.')
    finally:
      setLoading(false)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      {/* Payment method selection */}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Purchase'}
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
```

### 7. APIKeyDashboard Component

**Purpose**: Displays user's purchased API products and manages API keys.

**Interface**:
```typescript
interface APIKey {
  id: string;
  productId: string;
  productName: string;
  key: string;
  createdAt: string;
  expiresAt: string | null;
  usageStats: {
    requestCount: number;
    rateLimit: number;
    quotaRemaining: number;
  };
}

interface APIKeyDashboardProps {
  apiKeys: APIKey[];
  onRegenerate: (keyId: string) => void;
  onRevoke: (keyId: string) => void;
}
```

**Implementation Details**:
- Fetches user's API keys from backend
- Displays each key with APIKeyCard component
- Provides regenerate and revoke functionality
- Shows usage statistics
- Includes copy-to-clipboard for API keys

**Pseudocode**:
```
function APIKeyDashboard({apiKeys, onRegenerate, onRevoke}):
  return (
    <div>
      <h2>Your API Keys</h2>
      {apiKeys.length === 0 ? (
        <p>No API keys yet. Purchase an API product to get started.</p>
      ) : (
        <div className="grid">
          {apiKeys.map(apiKey => (
            <APIKeyCard
              key={apiKey.id}
              apiKey={apiKey}
              onRegenerate={() => onRegenerate(apiKey.id)}
              onRevoke={() => onRevoke(apiKey.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
```

### 8. APIKeyCard Component

**Purpose**: Displays a single API key with management controls.

**Interface**:
```typescript
interface APIKeyCardProps {
  apiKey: APIKey;
  onRegenerate: () => void;
  onRevoke: () => void;
}
```

**Implementation Details**:
- Shows masked API key with reveal/copy functionality
- Displays creation and expiration dates
- Shows usage statistics (requests, rate limit, quota)
- Provides regenerate and revoke buttons
- Confirmation dialog for destructive actions

**Pseudocode**:
```
function APIKeyCard({apiKey, onRegenerate, onRevoke}):
  showKey = useState(false)
  
  handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key)
    showToast('API key copied to clipboard')
  }
  
  handleRegenerate = () => {
    if confirm('Regenerate API key? The old key will be invalidated.'):
      onRegenerate()
  }
  
  handleRevoke = () => {
    if confirm('Revoke API key? This action cannot be undone.'):
      onRevoke()
  }
  
  displayKey = showKey ? apiKey.key : maskKey(apiKey.key)
  
  return (
    <div className="card">
      <h3>{apiKey.productName}</h3>
      <div className="key-display">
        <code>{displayKey}</code>
        <button onClick={() => setShowKey(!showKey)}>
          {showKey ? 'Hide' : 'Show'}
        </button>
        <button onClick={handleCopy}>Copy</button>
      </div>
      <div className="dates">
        <span>Created: {formatDate(apiKey.createdAt)}</span>
        {apiKey.expiresAt && <span>Expires: {formatDate(apiKey.expiresAt)}</span>}
      </div>
      <div className="usage-stats">
        <div>Requests: {apiKey.usageStats.requestCount}</div>
        <div>Rate Limit: {apiKey.usageStats.rateLimit}/hour</div>
        <div>Quota: {apiKey.usageStats.quotaRemaining} remaining</div>
      </div>
      <div className="actions">
        <button onClick={handleRegenerate}>Regenerate</button>
        <button onClick={handleRevoke} className="danger">Revoke</button>
      </div>
    </div>
  )
```

## Data Models

### Theme Configuration

```typescript
type Theme = 'dark' | 'light';

interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardBorder: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  error: string;
  success: string;
}

const themes: Record<Theme, ThemeColors> = {
  dark: {
    background: '#111827',    // gray-900
    foreground: '#f9fafb',    // gray-50
    card: '#1f2937',          // gray-800
    cardBorder: '#374151',    // gray-700
    primary: '#2dd4bf',       // teal-400
    secondary: '#14b8a6',     // teal-500
    accent: '#0d9488',        // teal-600
    muted: '#9ca3af',         // gray-400
    error: '#ef4444',         // red-500
    success: '#10b981',       // green-500
  },
  light: {
    background: '#ffffff',    // white
    foreground: '#111827',    // gray-900
    card: '#f9fafb',          // gray-50
    cardBorder: '#e5e7eb',    // gray-200
    primary: '#0d9488',       // teal-600
    secondary: '#14b8a6',     // teal-500
    accent: '#2dd4bf',        // teal-400
    muted: '#6b7280',         // gray-500
    error: '#dc2626',         // red-600
    success: '#059669',       // green-600
  }
};
```

### API Product Model

```typescript
interface APIProduct {
  id: string;                    // Unique identifier
  name: string;                  // English name
  nameFA: string;                // Persian name
  description: string;           // English description
  descriptionFA: string;         // Persian description
  category: string;              // e.g., "currencies", "gold", "crypto", "all"
  price: number;                 // Price in Toman or USD
  currency: string;              // "IRR" or "USD"
  rateLimit: string;             // e.g., "1000 requests/hour"
  quota: number;                 // Monthly request quota
  features: string[];            // List of features
  endpoints: string[];           // Available API endpoints
  documentation: string;         // URL to documentation
}
```

### API Key Model

```typescript
interface APIKey {
  id: string;                    // Unique key identifier
  userId: string;                // User who owns the key
  productId: string;             // Associated product
  productName: string;           // Product name for display
  key: string;                   // The actual API key (UUID or similar)
  createdAt: string;             // ISO 8601 timestamp
  expiresAt: string | null;      // ISO 8601 timestamp or null for no expiration
  status: 'active' | 'revoked';  // Key status
  usageStats: {
    requestCount: number;        // Total requests made
    rateLimit: number;           // Requests per hour limit
    quotaRemaining: number;      // Remaining monthly quota
    lastUsed: string | null;     // ISO 8601 timestamp of last use
  };
}
```

### Purchase Request Model

```typescript
interface PurchaseRequest {
  productId: string;
  email: string;
  paymentMethod: 'card' | 'crypto' | 'bank_transfer';
  paymentDetails: {
    // Payment-specific fields
    [key: string]: any;
  };
}

interface PurchaseResponse {
  success: boolean;
  message: string;
  apiKey?: string;              // Returned on success
  transactionId?: string;       // Payment transaction ID
  error?: string;               // Error message on failure
}
```

### Font Configuration

```typescript
interface FontConfig {
  family: string;
  weights: number[];
  display: 'swap' | 'block' | 'fallback' | 'optional';
  fallbacks: string[];
}

const iranyekanXConfig: FontConfig = {
  family: 'IranyekanX',
  weights: [400, 500, 700],
  display: 'swap',
  fallbacks: ['Tahoma', 'Arial', 'sans-serif']
};
```

### Price Data Model (Existing)

```typescript
interface PriceData {
  [key: string]: string | number;  // e.g., "usd": "65000", "bitcoin": "2500000000"
}

interface PriceResponse {
  data: PriceData;
  last_updated: string;
  status: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Theme Configuration Properties (3.1-3.4)**: These all test that theme objects have distinct values for different color properties. These can be combined into a single comprehensive property about theme configuration completeness.

2. **Display Properties (4.3, 4.6, 6.2, 6.6)**: Multiple properties test that components display required fields. These can be consolidated into properties about component rendering completeness.

3. **Font Application Properties (1.2, 7.3)**: Both test that IranyekanX font is applied to Persian text, just in different sections. These can be combined into one property about font application across the entire app.

4. **Functionality Existence Properties (6.3, 6.5)**: These test that regenerate and revoke functionality exist, which is redundant with properties 6.4 that test the actual behavior.

After reflection, the following properties provide unique validation value without redundancy:

### Font Integration Properties

**Property 1: Persian text font application**
*For any* Persian text element in the application (including Price_Display and API_Manager), the computed font-family should include IranyekanX as the primary font.
**Validates: Requirements 1.2, 7.3**

**Property 2: Font weight variety**
*For any* text element with font-weight specified (regular/400, medium/500, bold/700), the IranyekanX font should be applied with the correct weight value.
**Validates: Requirements 1.4**

### Theme System Properties

**Property 3: Theme toggle state transition**
*For any* current theme state (dark or light), clicking the theme toggle should transition to the opposite theme state.
**Validates: Requirements 2.2**

**Property 4: Theme consistency across components**
*For any* component in the application, when theme state is dark or light, the component should apply theme-appropriate CSS classes or styles from the theme configuration.
**Validates: Requirements 2.4**

**Property 5: Theme persistence round-trip**
*For any* theme state (dark or light), after setting the theme and reloading the application, the theme state should be restored to the same value from localStorage.
**Validates: Requirements 2.5, 2.6**

**Property 6: Theme color contrast compliance**
*For any* theme (dark or light), all text-background color combinations in the theme configuration should meet WCAG 2.1 AA contrast ratio requirements (minimum 4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 2.8, 9.2**

**Property 7: Theme configuration completeness**
*For any* theme (dark or light), the theme configuration object should contain distinct, non-null values for all required color properties: background, foreground, card, cardBorder, primary, secondary, accent, muted, error, and success.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

**Property 8: Price display contrast**
*For any* price card in the Price_Display component, when rendered with either theme, the contrast ratio between the price text and card background should meet WCAG 2.1 AA standards.
**Validates: Requirements 3.5**

**Property 9: Theme change propagation**
*For any* theme change event, all mounted components (including API_Manager) should update their rendered output to reflect the new theme within the same render cycle.
**Validates: Requirements 7.2**

### API Manager - Product Display Properties

**Property 10: API product list display**
*For any* non-empty array of API products, the APIProductList component should render a corresponding APIProductCard for each product in the array.
**Validates: Requirements 4.2**

**Property 11: Product card information completeness**
*For any* API product, the rendered APIProductCard should display all required fields: nameFA, descriptionFA, price, currency, rateLimit, and features list.
**Validates: Requirements 4.3, 4.6**

**Property 12: Product categorization**
*For any* array of API products with mixed categories, the APIProductList should group products by their category property and render them in separate sections.
**Validates: Requirements 4.4**

**Property 13: Product search filtering**
*For any* search query string and array of API products, the filtered results should only include products where the query appears in either nameFA or category fields (case-insensitive).
**Validates: Requirements 4.5**

### API Manager - Purchase Flow Properties

**Property 14: Product detail navigation**
*For any* API product selection event, the application should navigate to or display the detailed product view for that specific product.
**Validates: Requirements 5.1**

**Property 15: Purchase button presence**
*For any* API product displayed in detail view, a purchase button should be rendered and enabled (unless already purchased).
**Validates: Requirements 5.2**

**Property 16: API key uniqueness**
*For any* two successful purchase transactions (even for the same product), the generated API keys should be distinct and unique.
**Validates: Requirements 5.4**

**Property 17: API key display with copy**
*For any* generated API key, the display component should render the key value and provide a functional copy-to-clipboard button.
**Validates: Requirements 5.5**

### API Manager - Key Management Properties

**Property 18: API key dashboard completeness**
*For any* array of user API keys, the APIKeyDashboard should render an APIKeyCard for each key in the array.
**Validates: Requirements 6.1**

**Property 19: API key card information completeness**
*For any* API key, the rendered APIKeyCard should display all required fields: productName, key (masked or revealed), createdAt, expiresAt, and all usage statistics (requestCount, rateLimit, quotaRemaining).
**Validates: Requirements 6.2, 6.6**

**Property 20: API key regeneration behavior**
*For any* API key, after regeneration, the old key value should be different from the new key value, and the new key should have an updated createdAt timestamp.
**Validates: Requirements 6.3, 6.4**

**Property 21: API key revocation behavior**
*For any* API key, after revocation, the key status should be set to 'revoked' and the key should no longer be usable for API requests.
**Validates: Requirements 6.5**

**Property 22: Documentation access**
*For any* purchased API product, the user should have access to a documentation link or view for that product.
**Validates: Requirements 6.7**

### Integration Properties

**Property 23: Price display preservation**
*For any* price data response, after refactoring, the PriceDisplay component should render the same visual output (same prices, same layout) as the original implementation.
**Validates: Requirements 7.1**

**Property 24: RTL layout consistency**
*For any* component in the API_Manager section containing Persian text, the component should have dir="rtl" attribute or inherit RTL direction from a parent.
**Validates: Requirements 7.4**

**Property 25: Background price updates**
*For any* route or section of the application (including API_Manager), the price fetching interval should continue running and updating price data every 60 seconds.
**Validates: Requirements 7.6**

### Accessibility Properties

**Property 26: ARIA label presence**
*For any* interactive element (buttons, links, inputs) in the application, the element should have either an aria-label attribute, aria-labelledby attribute, or visible text content.
**Validates: Requirements 9.3**

**Property 27: Focus indicator visibility**
*For any* interactive element, when focused (via keyboard or programmatically), the element should have a visible focus indicator (outline, border, or background change) that meets WCAG visibility requirements.
**Validates: Requirements 9.5**

## Error Handling

### Font Loading Errors

**Scenario**: IranyekanX font fails to load from CDN or local source.

**Handling**:
1. Use `font-display: swap` to show fallback fonts immediately
2. Fallback chain: IranyekanX → Tahoma → Arial → sans-serif
3. No error message to user (graceful degradation)
4. Log warning to console for debugging

**Implementation**:
```css
@font-face {
  font-family: 'IranyekanX';
  src: url('/fonts/IranyekanX-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

### Theme Loading Errors

**Scenario**: localStorage is unavailable or corrupted.

**Handling**:
1. Catch localStorage access errors in try-catch block
2. Default to dark theme if localStorage read fails
3. Disable persistence if localStorage write fails
4. Log warning to console
5. Application remains functional without persistence

**Implementation**:
```javascript
function loadThemeFromStorage() {
  try {
    return localStorage.getItem('theme') || 'dark';
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
    return 'dark';
  }
}
```

### API Request Errors

**Scenario**: API requests fail (network error, server error, timeout).

**Handling**:
1. Display user-friendly error message in Persian
2. Provide retry button for failed requests
3. Show loading state during retry
4. Log detailed error to console
5. Maintain previous data if available (stale data better than no data)

**Error Types**:
- **Network Error**: "خطا در برقراری ارتباط. لطفا اتصال اینترنت خود را بررسی کنید."
- **Server Error**: "خطای سرور. لطفا بعدا دوباره تلاش کنید."
- **Timeout**: "زمان درخواست به پایان رسید. لطفا دوباره تلاش کنید."

### Purchase Flow Errors

**Scenario**: Payment processing fails or API key generation fails.

**Handling**:
1. Display specific error message from backend
2. Keep form data intact for retry
3. Provide "Try Again" button
4. Offer alternative payment methods if applicable
5. Show support contact information for persistent failures

**Error States**:
- Payment declined
- Invalid payment information
- Server error during key generation
- Duplicate purchase attempt

### API Key Management Errors

**Scenario**: Regenerate or revoke operations fail.

**Handling**:
1. Show error message with specific failure reason
2. Keep original key state unchanged
3. Provide retry option
4. Require confirmation before destructive operations
5. Log errors for support investigation

## Testing Strategy

### Dual Testing Approach

This feature will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

We will use **fast-check** (for JavaScript/TypeScript) as our property-based testing library. Fast-check integrates well with Jest and provides powerful generators for creating random test data.

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: frontend-refinement, Property {number}: {property_text}`

**Example Property Test Structure**:
```javascript
import fc from 'fast-check';

describe('Theme System Properties', () => {
  test('Property 3: Theme toggle state transition', () => {
    // Feature: frontend-refinement, Property 3: Theme toggle state transition
    fc.assert(
      fc.property(
        fc.constantFrom('dark', 'light'),
        (currentTheme) => {
          const nextTheme = toggleTheme(currentTheme);
          const expected = currentTheme === 'dark' ? 'light' : 'dark';
          expect(nextTheme).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

Unit tests will focus on:
- Specific examples (e.g., theme toggle button exists)
- Edge cases (e.g., empty API key list, font loading failure)
- Error conditions (e.g., failed API requests, invalid form data)
- Component integration points

**Testing Tools**:
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking for integration tests

**Example Unit Test Structure**:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle Component', () => {
  test('renders theme toggle button', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /switch to/i });
    expect(button).toBeInTheDocument();
  });

  test('handles font loading failure gracefully', () => {
    // Mock font loading failure
    document.fonts.load = jest.fn().mockRejectedValue(new Error('Font load failed'));
    
    render(<App />);
    
    // App should still render with fallback fonts
    expect(screen.getByText(/قیمت‌های لحظه‌ای بازار/)).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

- **Line Coverage**: Minimum 80%
- **Branch Coverage**: Minimum 75%
- **Function Coverage**: Minimum 85%
- **Property Coverage**: 100% of defined correctness properties

### Testing Priorities

**High Priority** (Must test):
1. Theme persistence and restoration (Properties 3, 5)
2. API key uniqueness and regeneration (Properties 16, 20)
3. Product search and filtering (Property 13)
4. Accessibility (Properties 26, 27)
5. Error handling for all API requests

**Medium Priority** (Should test):
1. Font application (Properties 1, 2)
2. Component rendering completeness (Properties 11, 19)
3. Theme consistency (Properties 4, 9)
4. Navigation and routing

**Lower Priority** (Nice to test):
1. Visual styling details
2. Animation timing
3. Performance metrics

### Integration Testing

Integration tests will verify:
- Complete purchase flow from product selection to API key display
- Theme switching across multiple components simultaneously
- Navigation between Price Display and API Manager
- Background price updates while using API Manager

### Manual Testing Checklist

Some requirements require manual verification:
- Cross-browser font rendering (Requirement 1.5)
- Responsive layout on real devices (Requirement 8.1)
- Touch-friendly controls on mobile (Requirement 8.4)
- Screen reader announcements (Requirement 9.4)
- Visual hierarchy and aesthetics (Requirement 3.6)

