import { render } from "@testing-library/react";
import GetGlucoseJournals from "./page.tsx";

jest.mock("../../contexts/PropContext", () => ({
	__esModule: true,
	useProp: jest.fn(() => ({
		handlePopUp: jest.fn(),
	})),
}));

const fakeUser = {
	uid: "1",
};

jest.mock("../../contexts/AuthContext", () => {
	return {
		useAuth: () => {
			return {
				user: fakeUser,
			};
		},
	};
});

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

jest.mock("../../contexts/UserContext", () => {
	return {
		useUser: () => {
			return {
				userInfo: {
					uid: "1",
				},
			};
		},
	};
});

describe("GetGlucoseJournals", () => {
	it("returns GetGlucoseJournalsPage component", () => {
		const { container } = render(<GetGlucoseJournals />);

		expect(container.textContent).toContain("Diabetes Journal");
	});
});
