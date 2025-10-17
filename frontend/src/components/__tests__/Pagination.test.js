import { render, screen, fireEvent } from '@testing-library/react';
import AllPlayersMain from '../AllPlayersMainTest/AllPlayersMain';



test('pagination works correctly', () => {
  render(<AllPlayersMain />);

  const nextButton = screen.getByLabelText(/next/i)
  const prevButton = screen.getByLabelText(/prev/i)
  const pageLabel = screen.getByText(/page 1/i);

  // Check initial page
  expect(pageLabel).toBeInTheDocument();

  // Click next page
  fireEvent.click(nextButton);
  expect(screen.getByText(/page 2/i)).toBeInTheDocument();

  // Click previous page
  fireEvent.click(prevButton);
  expect(screen.getByText(/page 1/i)).toBeInTheDocument();
});