import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import AudioVisualizer from './AudioVisualizer';

describe('AudioVisualizer', () => {
  it('should render without crashing', () => {
    const mockStream = new MediaStream();
    const { container } = render(<AudioVisualizer stream={mockStream} isRecording={true} />);

    expect(container).toBeInTheDocument();
  });

  it('should render canvas element', () => {
    const mockStream = new MediaStream();
    const { container } = render(<AudioVisualizer stream={mockStream} isRecording={true} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should handle inactive state', () => {
    const mockStream = new MediaStream();
    const { container } = render(<AudioVisualizer stream={mockStream} isRecording={false} />);

    expect(container).toBeInTheDocument();
  });

  it('should handle null stream gracefully', () => {
    const { container } = render(<AudioVisualizer stream={null} isRecording={true} />);

    expect(container).toBeInTheDocument();
  });

  it('should render with proper dimensions', () => {
    const mockStream = new MediaStream();
    const { container } = render(<AudioVisualizer stream={mockStream} isRecording={true} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('width');
    expect(canvas).toHaveAttribute('height');
  });
});
