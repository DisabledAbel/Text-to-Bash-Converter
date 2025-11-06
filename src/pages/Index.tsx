// src/pages/Index.tsx
import React, { Suspense, Component, ReactNode } from "react";
import TextConverter from "../components/TextConverter";

// Error boundary to catch any errors in child components
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Error in component:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>Oops! Something went wrong while loading the Text Converter.</div>;
    }

    return this.props.children;
  }
}

const Index = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading Text Converter...</div>}>
        <TextConverter />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;
