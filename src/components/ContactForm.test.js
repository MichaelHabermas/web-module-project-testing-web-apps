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
	expect(header).toBeVisible();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
	render(<ContactForm />);
	const firstName = 'Bob';

	const firstNameInput = screen.getByLabelText(/first name/i);
	userEvent.type(firstNameInput, firstName);

	const errorMessages = screen.queryAllByText(/error/i);
	expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
	render(<ContactForm />);

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessages = screen.queryAllByText(/error/i);
	expect(errorMessages).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
	render(<ContactForm />);
	const firstName = 'Robert';
	const lastName = 'Paulson';
	// const email = 'qwerttyyu';

	const firstNameInput = screen.getByLabelText(/first name/i);
	userEvent.type(firstNameInput, firstName);

	const lastNameInput = screen.getByLabelText(/last name/i);
	userEvent.type(lastNameInput, lastName);

	// const emailInput = screen.getByLabelText(/email/i);
	// userEvent.type(emailInput, email);

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessages = screen.queryAllByText(/error/i);
	expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
	render(<ContactForm />);
	const email = 'qwerttyyu';

	const emailInput = screen.getByLabelText(/email/i);
	userEvent.type(emailInput, email);

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessage = screen.queryByText(/email must be a valid email address/i);
	expect(errorMessage).toBeVisible();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
	render(<ContactForm />);

	const button = screen.getByRole('button');
	userEvent.click(button);

	const errorMessage = screen.queryByText(/lastName is a required field/i);
	expect(errorMessage).toBeVisible();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
	render(<ContactForm />);
	const firstName = 'Robert';
	const lastName = 'Paulson';
	const email = 'bobbypaulson@aol.com';

	const firstNameInput = screen.getByLabelText(/first name/i);
	const lastNameInput = screen.getByLabelText(/last name/i);
	const emailInput = screen.getByLabelText(/email/i);

	userEvent.type(firstNameInput, firstName);
	userEvent.type(lastNameInput, lastName);
	userEvent.type(emailInput, email);

	const messageDiv = screen.queryByText(/you submitted/i);
	expect(messageDiv).toBeFalsy();

	const button = screen.getByRole('button');
	userEvent.click(button);

	const firstNameDisplay = screen.queryByTestId('firstnameDisplay');
	const lastNameDisplay = screen.queryByTestId('lastnameDisplay');
	const emailDisplay = screen.queryByTestId('emailDisplay');

	expect(firstNameDisplay).toBeVisible();
	expect(lastNameDisplay).toBeVisible();
	expect(emailDisplay).toBeVisible();

	//test for message to not be there
	const messageDisplay = screen.queryByText(/message:/i);
	expect(messageDisplay).not.toBeVisible();
});

test('renders all fields text when all fields are submitted.', async () => {
	render(<ContactForm />);
	const firstName = 'Robert';
	const lastName = 'Paulson';
	const email = 'bobbypaulson@aol.com';

	const firstNameInput = screen.getByLabelText(/first name/i);
	const lastNameInput = screen.getByLabelText(/last name/i);
	const emailInput = screen.getByLabelText(/email/i);

	userEvent.type(firstNameInput, firstName);
	userEvent.type(lastNameInput, lastName);
	userEvent.type(emailInput, email);

	const button = screen.getByRole('button');
	userEvent.click(button);

	const firstNameDisplay = await screen.findByTestId('firstnameDisplay');
	// console.log(firstNameDisplay);
	// const lastNameDisplay = screen.queryByTestId('lastnameDisplay');
	// const emailDisplay = screen.queryByTestId('emailDisplay');

	expect(firstNameDisplay).toBeVisible();
	expect(screen.getByText(/robert/i)).toBeTruthy();
	screen.getByText(/robert/i);
	// const fnTxt = screen.getByText(/first name/i);

	// expect(lastNameDisplay).toBeVisible();
	// expect(emailDisplay).toBeVisible();
});
