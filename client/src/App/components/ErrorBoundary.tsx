import { node, string } from 'prop-types';
import React, { Component } from 'react';

import { ErrorCard } from './ErrorCard';

import type { PropsWithChildren, ReactNode, ErrorInfo } from 'react';

type ErrorBoundaryProps = {
  displayName: string;
  fallback?: ReactNode;
}

type ErrorBoundaryPropsWithChildren = PropsWithChildren<ErrorBoundaryProps>;

type ErrorBoundaryState = {
  error?: Error;
  hasError: boolean;
}

/**
 * Catches errors thrown during rendering
 * Renders some fallback UI in place of crashed children
 */
export class ErrorBoundary extends Component<ErrorBoundaryPropsWithChildren, ErrorBoundaryState> {
  static propTypes = {
    children: node.isRequired,
    displayName: string.isRequired,
    fallback: node,
  };

  constructor(props: ErrorBoundaryPropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Update component state in response to an error thrown during rendering
   * @param error The error that was caught
   * @returns The value to use for the next component state
   */
  static getDerivedStateFromError(error: Error) {
    // Trigger a state update to render the fallback UI
    return {
      error,
      hasError: true,
    };
  }

  /**
   * 
   * @param error The error that was caught
   * @param info An object containing details about the component the contained the error
   */
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`componentDidCatch(${this.props.displayName}) - error: ${error.name}: ${error.message}`);
    console.error(`componentDidCatch(${this.props.displayName}) - info.componentStack: ${info.componentStack}`);
    console.error(`componentDidCatch(${this.props.displayName}) - info.digest: ${info.digest}`);
  }

  /**
   * Get the component to render when an error is caught at the boundary
   * @param error The error that was caught
   * @param fallback An optional, custom component to render in place of crashed children
   * @returns The component to render in place of crashed children
   */
  getErrorComponent(error?: Error, fallback?: ReactNode) {
    if (fallback) {
      return fallback;
    }
    // This guards an unlikely (impossible?) edge case because
    // there should always be an error on state when this method is called
    // But conditionally passing a generic error here makes Typescript happy
    const errorToPrint = error || new Error(`unable to get error caught by ${this.props.displayName}`);
    return <ErrorCard error={errorToPrint} />;
  }

  render() {
    if (this.state.hasError) {
      return this.getErrorComponent(this.state.error, this.props.fallback);
    }
    return this.props.children;
  }
}
