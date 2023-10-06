import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditProfilePage from './editProfilePage';
import updateUser from '../http/updateUser';

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));
const mockUpdateCurrentUser = jest.fn();
jest.mock('../contexts/UserContext', () => {
    const originalModule = jest.requireActual('../contexts/UserContext');
    const mockUserInfo = {
        firstName: 'John',
        lastName: 'Doe',
        streetAddress: '1234 Main St',
        city: 'Mock City',
        province: 'Mock Province',
        postalCode: 'A1A 1A1',
        phoneNumber: '123-456-7890',
    };

    return {
        ...originalModule,
        useUser: jest.fn(() => ({
            updateCurrentUser: jest.fn(),  // Mock the updateCurrentUser function
            userInfo: mockUserInfo
        })),
        // ...
    }
});




describe("Error Messages", () => {
    test("All fields are visible to the user", () => {
        render(<EditProfilePage/>);
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const street = screen.getByLabelText("Street Address");
        const city = screen.getByLabelText("City");
        const province = screen.getByLabelText("Province");
        const postalCode = screen.getByLabelText("Postal Code");
        const phone = screen.getByLabelText("Phone Number");
        const cancelButton = screen.getAllByRole("button")[0];
        const submitButton = screen.getAllByRole("button")[1];

        expect(firstName).toBeInTheDocument();
        expect(lastName).toBeInTheDocument();
        expect(street).toBeInTheDocument();
        expect(city).toBeInTheDocument();
        expect(province).toBeInTheDocument();
        expect(postalCode).toBeInTheDocument();
        expect(phone).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    })

    test("First Name error message", async () => {
        render(<EditProfilePage/>);
        const fname = await screen.findByLabelText("First Name");
        await userEvent.type(fname, "georgia9");
        fireEvent.blur(fname);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Last Name error message", async () => {
        render(<EditProfilePage/>);
        const lname = await screen.findByLabelText("Last Name");
        await userEvent.type(lname, "georgia9");
        fireEvent.blur(lname);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Postal Code error message", async () => {
        render(<EditProfilePage/>);
        const postalCode = await screen.findByLabelText("Postal Code");
        await userEvent.type(postalCode, "H8SSSS");
        fireEvent.blur(postalCode);
        const error = await screen.findByText("Invalid Postal Code");
        expect(error).toBeInTheDocument();
    })

    test("Phone Number error message", async () => {
        render(<EditProfilePage/>);
        const phone = await screen.findByLabelText("Phone Number");
        await userEvent.type(phone, "123123");
        fireEvent.blur(phone);
        const error = await screen.findByText("Please enter a 10 digit number");
        expect(error).toBeInTheDocument();
    })

    test("Cancel Button functions correctly", async () =>{
        render(<EditProfilePage/>);
        const cancelButton = screen.getAllByRole("button")[0];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledTimes(1);
    })


})