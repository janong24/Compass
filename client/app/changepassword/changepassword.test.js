import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePassword from "./page";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";
import { auth } from "../config/firebase";
import Swal from "sweetalert2";

// Mocking the next/navigation and firebase dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}));

// Mocking SweetAlert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

describe("ChangePassword tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders without errors", () => {
    render(<ChangePassword />);
    expect(screen.getByText("Change your password")).toBeInTheDocument();
  });

  test("handles current password visibility toggle", () => {
    render(<ChangePassword />);
    const currentPasswordInput = screen.getByLabelText("Current Password");
    const visibilityButton =
      screen.getByText("Current Password").parentNode.lastChild;

    expect(currentPasswordInput.type).toBe("password");

    fireEvent.click(visibilityButton);

    expect(currentPasswordInput.type).toBe("password");
  });

  test("handles new password visibility toggle", () => {
    render(<ChangePassword />);
    const newPasswordInput = screen.getByLabelText("New Password");
    const visibilityButton =
      screen.getByText("New Password").parentNode.lastChild;

    expect(newPasswordInput.type).toBe("password");

    fireEvent.click(visibilityButton);

    expect(newPasswordInput.type).toBe("password");
  });

  test("submits the form successfully", async () => {
    const mockUserId = "123";
    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    render(<ChangePassword />);
    // Mocking user input
    userEvent.type(
      screen.getByLabelText(/current password/i),
      "currentPassword123"
    );
    userEvent.type(screen.getByLabelText(/new password/i), "newPassword123");
    userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "newPassword123"
    );

    // Mocking the reauthentication success
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    fireEvent.click(screen.getByText("Change Password"));

    // Wait for asynchronous tasks to complete
    await waitFor(() => {
      expect(require("../config/firebase").updatePassword).toHaveBeenCalledWith(
        expect.any(Object),
        "newPassword123"
      );
      expect(
        screen.getByText(/password changed successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("handles reauthentication failure", async () => {
    // Mock the push from router
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(<ChangePassword />);
    const newPassword = "newPassword123";
    const confirmPassword = "newPassword123";

    userEvent.type(
      screen.getByLabelText("Current Password"),
      "incorrectPassword"
    );
    userEvent.type(screen.getByLabelText("New Password"), newPassword);
    userEvent.type(screen.getByLabelText("Confirm Password"), confirmPassword);

    fireEvent.click(screen.getByText("Change Password"));

    // Ensure that the reauthentication failure message is displayed
    await waitFor(() => {
      expect(
        screen.getByText("Incorrect current password")
      ).toBeInTheDocument();
    });

    // Ensure that the success alert is not shown
    expect(screen.queryByText("Password changed successfully!")).toBeNull();

    // Ensure that the router push is not called
    expect(mockPush).toNotHaveBeenCalled();
  });
});
