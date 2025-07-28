# Technical Specification - Live Talent Show Voting System

## Architecture Overview

### Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **State Management**: React hooks (useState, useEffect, custom hooks)
- **Data Persistence**: Browser localStorage
- **Testing**: Vitest + React Testing Library (setup ready)

### Project Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── ErrorBoundary.tsx   # Error handling component
│   ├── ContestantCard.tsx  # Individual contestant display
│   ├── VotingHeader.tsx    # Main header with status
│   └── LoadingSpinner.tsx  # Loading states
├── hooks/
│   ├── useVoting.ts        # Voting logic and state management
│   ├── useLiveData.ts      # Real-time data simulation
│   └── use-toast.ts        # Toast notifications
├── pages/
│   ├── Index.tsx           # Main entry point
│   ├── VotingPage.tsx      # Primary voting interface
│   └── NotFound.tsx        # 404 error page
└── assets/                 # Images and static assets
```

## Core Components

### 1. Custom Hooks

#### useVoting Hook
**Purpose**: Manages all voting-related state and business logic

**Features**:
- Vote state persistence in localStorage
- Vote submission with API simulation
- Vote validation and error handling
- Real-time vote count management

**Key Methods**:
```typescript
interface VotingHook {
  votingState: VotingState;
  castVote: (contestantId: string) => Promise<boolean>;
  getContestantVoteCount: (contestantId: string) => number;
  hasVotedFor: (contestantId: string) => boolean;
  resetVotes: () => void;
  setIsVotingActive: (active: boolean) => void;
}
```

#### useLiveData Hook
**Purpose**: Simulates real-time data updates and contestant management

**Features**:
- Mock contestant data generation
- Periodic vote count updates (5-10 second intervals)
- Loading state management
- Data refresh capabilities

### 2. Error Boundaries

#### ErrorBoundary Component
**Purpose**: Catches JavaScript errors and provides graceful fallback UI

**Features**:
- Automatic error detection and logging
- User-friendly error messages
- Recovery options (retry, refresh page)
- Error details for debugging

**Implementation**:
- Class-based component using componentDidCatch
- Fallback UI with action buttons
- Error state isolation per component tree

### 3. Responsive Design System

#### Design Tokens (index.css)
- **Colors**: HSL-based color system with entertainment theme
- **Gradients**: Stage lighting and spotlight effects
- **Shadows**: Depth and glow effects for visual hierarchy
- **Animations**: Smooth transitions and micro-interactions

#### Responsive Breakpoints
- **Mobile First**: Base styles for mobile devices
- **Tablet**: 768px and above
- **Desktop**: 1024px and above
- **Large Desktop**: 1400px and above

#### Grid System
```css
/* Contestant grid - responsive */
grid-cols-1        /* Mobile: 1 column */
md:grid-cols-2     /* Tablet: 2 columns */
lg:grid-cols-3     /* Desktop: 3 columns */
xl:grid-cols-4     /* Large: 4 columns */
```

### 4. Form Validation & Vote Handling

#### Vote Validation Rules
1. **Single Vote Constraint**: Check localStorage for existing votes
2. **Voting Window**: Validate voting is currently active
3. **Rate Limiting**: Prevent rapid successive submissions
4. **Input Sanitization**: Validate contestant ID format

#### Error Handling Patterns
```typescript
// Comprehensive error handling in useVoting hook
try {
  await submitVote(contestantId);
  showSuccessToast();
} catch (error) {
  handleVoteError(error);
  showErrorToast();
} finally {
  setIsLoading(false);
}
```

### 5. Real-Time Data Simulation

#### Update Mechanisms
- **Polling Interval**: 5-10 second randomized intervals
- **Vote Simulation**: Random vote increases for contestants
- **Update Batching**: Efficient state updates to prevent re-render issues

#### Data Flow
```
useLiveData Hook → State Update → UI Re-render → Visual Feedback
```

### 6. State Management Architecture

#### Component State Isolation
- **Voting Logic**: Isolated in useVoting hook
- **Data Management**: Separated in useLiveData hook
- **UI State**: Local component state for interactions
- **Error State**: Boundary-isolated error handling

#### Data Persistence Strategy
```typescript
// localStorage key-value structure
'talent-voting-state': {
  hasVoted: boolean,
  votedFor: string | null,
  remainingVotes: number
}
```

## Performance Optimizations

### 1. Efficient Re-rendering
- **React.memo**: Memoized contestant cards
- **useCallback**: Memoized event handlers
- **useMemo**: Memoized computed values

### 2. Image Optimization
- **Lazy Loading**: Images load as needed
- **Responsive Images**: Multiple sizes for different devices
- **Placeholder Strategy**: Graceful loading states

### 3. Bundle Optimization
- **Code Splitting**: Dynamic imports for routes
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Compressed images and fonts

## Error Handling Strategy

### 1. Error Boundary Implementation
```typescript
// Hierarchical error boundaries
<ErrorBoundary>           // App-level
  <VotingPage>
    <ErrorBoundary>       // Feature-level
      <ContestantCard>
    </ErrorBoundary>
  </VotingPage>
</ErrorBoundary>
```

### 2. Graceful Degradation
- **Network Failures**: Cached data display
- **JavaScript Errors**: Fallback UI components
- **Image Load Failures**: Default placeholder images
- **Storage Failures**: In-memory state fallback

### 3. User Feedback
- **Toast Notifications**: Real-time user feedback
- **Loading States**: Clear operation progress
- **Error Messages**: Actionable error descriptions
- **Recovery Options**: User-initiated retry mechanisms

## Testing Strategy

### Test Coverage Areas
1. **Vote Button Behavior**: Disabled state after voting
2. **localStorage Persistence**: Vote state across reloads
3. **Error Boundary Functionality**: Graceful error handling
4. **Responsive Design**: Layout adaptation across devices
5. **Form Validation**: Vote limit enforcement
6. **Real-time Updates**: Data synchronization

### Testing Tools Setup
- **Unit Tests**: Vitest for hook testing
- **Component Tests**: React Testing Library
- **Integration Tests**: Full user flow testing
- **Visual Tests**: Responsive design validation

## Security Considerations

### 1. Client-Side Security
- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Secure content rendering
- **localStorage Security**: No sensitive data storage

### 2. Vote Integrity
- **Duplicate Prevention**: localStorage-based validation
- **Rate Limiting**: Client-side submission throttling
- **Data Validation**: Type-safe vote handling

## Deployment & Monitoring

### Build Process
```bash
npm run build    # Production build
npm run preview  # Build preview
npm run test     # Test suite
```

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Error Tracking**: Boundary error logging
- **User Analytics**: Voting behavior metrics
- **Performance Metrics**: Load time and interaction responsiveness