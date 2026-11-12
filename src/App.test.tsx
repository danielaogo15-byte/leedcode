import App from '@/App';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('App', () => {
  it('renders VibeCode Dojo shell and switches tracks', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'VibeCode Dojo' }),
    ).toBeInTheDocument();

    const logicBtn = screen.getByRole('button', { name: /Код \/ Логика/i });
    fireEvent.click(logicBtn);

    expect(
      screen.getByRole('heading', { name: /Сумма чётных чисел/i }),
    ).toBeInTheDocument();
  });

  it('toggles Hardcore mode switch', () => {
    render(<App />);

    const hardcoreSwitch = screen.getByRole('switch', { name: /Hardcore/i });
    expect(hardcoreSwitch).toHaveAttribute('data-state', 'unchecked');

    fireEvent.click(hardcoreSwitch);
    expect(hardcoreSwitch).toHaveAttribute('data-state', 'checked');
  });
});