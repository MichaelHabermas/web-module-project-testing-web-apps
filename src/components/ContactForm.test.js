import React from 'react';
import { queryByText, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', () => {
	render(<ContactForm />);
});

test('renders the contact form header', () => {
	render(<ContactForm />);
	const header = screen.queryByText(/contact form/i);
	expect(header).toBeInTheDocument();
	expect(header).toBeTruthy();
	expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
	render(<ContactForm />);
	const firstName = 'Bobb';

	const firstNameInput = screen.getByLabelText(/first name/i);
	userEvent.type(firstNameInput, firstName);

	const errorMessages = await screen.queryAllByTestId(/error/i);
	expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
	render(<ContactForm />);

	const firstNameInput = screen.getByLabelText(/first name*/i);
	const lastNameInput = screen.getByLabelText(/last name*/i);
	const emailInput = screen.getByLabelText(/email*/i);
	const messageInput = screen.getByLabelText(/message/i);

	expect(firstNameInput).toHaveValue('');
	expect(lastNameInput).toHaveValue('');
	expect(emailInput).toHaveValue('');
	expect(messageInput).toHaveValue('');

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessages = await screen.queryAllByTestId(/error/i);
	expect(errorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
	render(<ContactForm />);
	const firstName = 'Robert';
	const lastName = 'Paulson';

	const firstNameInput = screen.getByLabelText(/first name/i);
	const lastNameInput = screen.getByLabelText(/last name/i);
	const emailInput = screen.getByLabelText(/email*/i);

	userEvent.type(firstNameInput, firstName);
	userEvent.type(lastNameInput, lastName);

	expect(firstNameInput).toHaveValue(firstName);
	expect(lastNameInput).toHaveValue(lastName);
	expect(emailInput).toHaveValue('');

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessages = await screen.queryAllByTestId(/error/i);
	expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
	render(<ContactForm />);
	const email = 'qwerttyyu';

	const emailInput = screen.getByLabelText(/email*/i);
	userEvent.type(emailInput, email);
	expect(emailInput).toHaveValue(email);

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessage = await screen.findByText(/email must be a valid email address/i);
	expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
	render(<ContactForm />);

	const lastNameInput = screen.getByLabelText(/last name*/i);
	expect(lastNameInput).toHaveValue('');

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessage = await screen.queryByText(/lastName is a required field/i);
	expect(errorMessage).toBeVisible();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
	render(<ContactForm />);
	const firstName = 'Robert';
	const lastName = 'Paulson';
	const email = 'bobbypaulson@aol.com';

	const firstNameInput = screen.getByLabelText(/first name*/i);
	const lastNameInput = screen.getByLabelText(/last name*/i);
	const emailInput = screen.getByLabelText(/email*/i);
	const messageInput = screen.getByLabelText(/message/i);

	userEvent.type(firstNameInput, firstName);
	userEvent.type(lastNameInput, lastName);
	userEvent.type(emailInput, email);

	expect(firstNameInput).toHaveValue(firstName);
	expect(lastNameInput).toHaveValue(lastName);
	expect(emailInput).toHaveValue(email);
	expect(messageInput).toHaveValue('');

	const messageDiv = screen.queryByText(/you submitted/i);
	expect(messageDiv).toBeFalsy();

	const button = screen.getByRole('button');
	userEvent.click(button);

	const firstNameDisplay = await screen.findByTestId('firstnameDisplay');
	const lastNameDisplay = await screen.findByTestId('lastnameDisplay');
	const emailDisplay = await screen.findByTestId('emailDisplay');
	const messageDisplay = screen.queryByTestId('messageDisplay');

	expect(firstNameDisplay).toBeTruthy();
	expect(firstNameDisplay).toBeInTheDocument();
	expect(firstNameDisplay).toHaveTextContent(/robert/i);

	expect(lastNameDisplay).toBeTruthy();
	expect(lastNameDisplay).toBeInTheDocument();
	expect(lastNameDisplay).toHaveTextContent(/paulson/i);

	expect(emailDisplay).toBeTruthy();
	expect(emailDisplay).toBeInTheDocument();
	expect(emailDisplay).toHaveTextContent(/bobbypaulson@aol.com/i);

	expect(messageDisplay).toBeFalsy();
	expect(messageDisplay).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
	render(<ContactForm />);
	const firstName = 'Robert';
	const lastName = 'Paulson';
	const email = 'bobbypaulson@aol.com';
	const message = 'This is only a test.';

	const firstNameInput = screen.getByLabelText(/first name*/i);
	const lastNameInput = screen.getByLabelText(/last name*/i);
	const emailInput = screen.getByLabelText(/email*/i);
	const messageInput = screen.getByLabelText(/message/i);

	userEvent.type(firstNameInput, firstName);
	userEvent.type(lastNameInput, lastName);
	userEvent.type(emailInput, email);
	userEvent.type(messageInput, message);

	expect(firstNameInput).toHaveValue(firstName);
	expect(lastNameInput).toHaveValue(lastName);
	expect(emailInput).toHaveValue(email);
	expect(messageInput).toHaveValue(message);

	const button = screen.getByRole('button');
	userEvent.click(button);

	const firstNameDisplay = await screen.findByTestId('firstnameDisplay');
	const lastNameDisplay = await screen.findByTestId('lastnameDisplay');
	const emailDisplay = await screen.findByTestId('emailDisplay');
	const messageDisplay = await screen.findByTestId('messageDisplay');

	expect(firstNameDisplay).toBeTruthy();
	expect(firstNameDisplay).toBeInTheDocument();
	expect(firstNameDisplay).toHaveTextContent(/robert/i);

	expect(lastNameDisplay).toBeTruthy();
	expect(lastNameDisplay).toBeInTheDocument();
	expect(lastNameDisplay).toHaveTextContent(/paulson/i);

	expect(emailDisplay).toBeTruthy();
	expect(emailDisplay).toBeInTheDocument();
	expect(emailDisplay).toHaveTextContent(/bobbypaulson@aol.com/i);

	expect(messageDisplay).toBeTruthy();
	expect(messageDisplay).toBeInTheDocument();
	expect(messageDisplay).toHaveTextContent(/This is only a test./i);
});
