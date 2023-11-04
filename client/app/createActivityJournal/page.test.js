import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateActivityJournal from './page'
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

const mockRouter= jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    },
    usePathname: () => mockUsePathname()
}));

jest.mock("../contexts/AuthContext", () =>{
    return {
        useAuth: jest.fn(),
    }
})

jest.mock("../contexts/UserContext", () =>{
    return {
        useUser: jest.fn(),
    }
})

describe("Activity journal page shown only to logged in users", () =>{

    it("Error page is shown", async () => {
        useAuth.mockImplementation(() => {
            return {
            user: null,
            };
        });
        
        render(<CreateActivityJournal />);
        const errorMessage = await screen.findByText("Error 403 - Access Forbidden");
        expect(errorMessage).toBeInTheDocument();
    })


    it("Error page is not shown", async () =>{
        useAuth.mockImplementation(() => {
            return {
            user: { uid: "AKSODN#KLAD12nkvs" },
            };
        });

        useUser.mockImplementation(() => {
            return {
                userInfo: { uid: "AKSODN#KLAD12nkvs" },
            };
        });

        render(<CreateActivityJournal/>);
        const errorMessage = screen.queryByText("Error 403 - Access Forbidden");
        expect(errorMessage).not.toBeInTheDocument();
        })
})