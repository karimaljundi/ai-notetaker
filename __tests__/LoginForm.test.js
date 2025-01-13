import '@testing-library/jest-dom';
import LoginForm from '../components/LoginForm';
test('renders MyExampleComponent correctly', () => {
  render(<LoginForm />);
  expect(screen.getByText('Name')).toBeInTheDocument();
});