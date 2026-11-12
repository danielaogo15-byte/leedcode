import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
	it('renders the VibeCode Dojo trainer header', () => {
	  render(<App />);
	  expect(
		 screen.getByRole('heading', { name: /VibeCode Dojo/i }),
	  ).toBeInTheDocument();
	});
 });

  it('для logic без DOM показывает только JS-редактор', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Логика' }));
    await user.click(screen.getByRole('button', { name: /Сумма чётных/ }));

    expect(screen.getByLabelText('JavaScript')).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'HTML' })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Превью задачи')).not.toBeInTheDocument();
    expect(screen.queryByText(/HTML-заготовка/)).not.toBeInTheDocument();
  });

  it('для logic с DOM показывает HTML-заготовку только для чтения', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Логика' }));
    await user.click(screen.getByRole('button', { name: /Переключить класс/ }));

    expect(screen.getByText(/HTML-заготовка/)).toBeInTheDocument();
    expect(screen.getByTitle('Превью задачи')).toBeInTheDocument();
    expect(screen.getByLabelText('JavaScript')).toBeInTheDocument();
    expect(screen.queryByLabelText('HTML')).not.toBeInTheDocument();
  });

  it('скрывает решение, пока не нажато «Сдаюсь»', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByText(/Эталон скрыт, пока задача не решена/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сдаюсь' }));

    expect(screen.getByText(/Решение:/)).toBeInTheDocument();
  });
});
