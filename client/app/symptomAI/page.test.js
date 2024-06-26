import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useAuth } from "../contexts/AuthContext";
import GetSymptomAI from './page'

const mockRouter = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
	usePathname: () => mockUsePathname(),
}));

jest.mock("../contexts/AuthContext", () => {
	return {
		useAuth: jest.fn(),
	};
});

describe("Symtom checker page shown only to logged in users", () => {
    it("Error page is shown", async () => {
		useAuth.mockImplementation(() => {
			return {
				user: null,
			};
		});

		render(<GetSymptomAI />);
		const errorMessage = await screen.findByText(
			"Error 403 - Access Forbidden"
		);
		expect(errorMessage).toBeInTheDocument();
	});

    it("Error page is not shown", async () => {
		useAuth.mockImplementation(() => {
			return {
				user: { uid: "AKSODN#KLAD12nkvs" },
			};
		});

		render(<GetSymptomAI />);
		const errorMessage = screen.queryByText("Error 403 - Access Forbidden");
		expect(errorMessage).not.toBeInTheDocument();
	});
})