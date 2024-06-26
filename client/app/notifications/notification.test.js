import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NotificationPage from "./notificationPage";
import "@testing-library/jest-dom";
import {
  getNotificationPreference,
  updateNotificationPreference,
  createNotificationPreference,
} from "../http/notificationPreferenceAPI";
import { act } from "react-dom/test-utils";
import { useProp } from "../contexts/PropContext";
import { create } from "domain";

//Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

//Mock back from next Router
const mockRouter = jest.fn();

//Setitng useRouter mock behaviour before executing tests
beforeAll(() => {
  useRouter.mockReturnValue({
    query: {},
    push: mockRouter,
  });
});

const userData = {
  uid: "1",
};

//Mock user
jest.mock("../contexts/UserContext", () => {
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

//Mock http request to get notification preferences
jest.mock("../http/notificationPreferenceAPI", () => {
  return {
    getNotificationPreference: jest.fn(),
    updateNotificationPreference: jest.fn(),
    createNotificationPreference: jest.fn(),
  };
});

// Mocking useProp hook
jest.mock("../contexts/PropContext", () => ({
  __esModule: true,
  useProp: jest.fn(() => ({
    handlePopUp: jest.fn(),
  })),
}));

// Mock logger
const logger = require("../../logger");
jest.mock("../../logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe("Notification Settings Page", () => {
  //Test to check if page is rendered correctly with proper text and button
  test("Renders correct content and button", async () => {
    render(<NotificationPage />);
    global.alert = jest.fn();
    const PushNotificationsHeader =
      screen.getAllByText(/Push Notifications/i)[0];
    const SubscriptionReminder = screen.getByText(/Enable Push Notifications/i);
    const ActivityReminders = screen.getByText(/Activity Reminders/i);
    const MedicationReminders = screen.getByText(/Medication Reminders/i);
    const AppointmentReminders = screen.getByText(/Appointment Reminders/i);
    const FoodIntakeReminders = screen.getByText(/Food Intake Reminders/i);
    const BloodGlucoseReminders = screen.getByText(/Blood Glucose Reminders/i);
    const InsulinInjectionReminders = screen.getByText(
      /Insulin Injection Reminders/
    );
    const MoodReminders = screen.getByText(/Mood Reminders/);
    const BackButton = screen.getAllByRole("button")[0];
    const Save = screen.getAllByRole("button")[1];

    expect(PushNotificationsHeader).toBeInTheDocument();
    expect(SubscriptionReminder).toBeInTheDocument();
    expect(ActivityReminders).toBeInTheDocument();
    expect(MedicationReminders).toBeInTheDocument();
    expect(AppointmentReminders).toBeInTheDocument();
    expect(FoodIntakeReminders).toBeInTheDocument();
    expect(BloodGlucoseReminders).toBeInTheDocument();
    expect(InsulinInjectionReminders).toBeInTheDocument();
    expect(MoodReminders).toBeInTheDocument();

    expect(BackButton).toBeInTheDocument();
    await mockRouter();
    expect(mockRouter).toHaveBeenCalledTimes(1);

    expect(Save).toBeInTheDocument();
    fireEvent.click(Save);
    await updateNotificationPreference;
  });

  test("Check if switch button works", () => {
    render(<NotificationPage />);
    const toggleButtonSubscription =
      screen.getByLabelText("SubscriptionSwitch");
    const toggleButtonActvity = screen.getByLabelText("ActvitySwitch");
    const toggleButtonMedication = screen.getByLabelText("MedicationSwitch");
    const toggleButtonAppointment = screen.getByLabelText("AppointmentSwitch");
    const toggleButtonFoodIntake = screen.getByLabelText("FoodIntakeSwitch");
    const toggleButtonBloodGlucose =
      screen.getByLabelText("BloodGlucoseSwitch");
    const toggleButtonInsulinDosage = screen.getByLabelText(
      "InsulinInjectionSwitch"
    );
    const toggleButtonMood = screen.getByLabelText("MoodSwitch");
    expect(toggleButtonSubscription).not.toBeChecked();
    expect(toggleButtonActvity).not.toBeChecked();
    expect(toggleButtonMedication).not.toBeChecked();
    expect(toggleButtonAppointment).not.toBeChecked();
    expect(toggleButtonFoodIntake).not.toBeChecked();
    expect(toggleButtonBloodGlucose).not.toBeChecked();
    expect(toggleButtonInsulinDosage).not.toBeChecked();
    expect(toggleButtonMood).not.toBeChecked();
    fireEvent.click(toggleButtonSubscription);
    fireEvent.click(toggleButtonActvity);
    fireEvent.click(toggleButtonMedication);
    fireEvent.click(toggleButtonAppointment);
    fireEvent.click(toggleButtonFoodIntake);
    fireEvent.click(toggleButtonBloodGlucose);
    fireEvent.click(toggleButtonInsulinDosage);
    fireEvent.click(toggleButtonMood);
    expect(toggleButtonSubscription).toBeChecked();
    expect(toggleButtonActvity).toBeChecked();
    expect(toggleButtonMedication).toBeChecked();
    expect(toggleButtonAppointment).toBeChecked();
    expect(toggleButtonFoodIntake).toBeChecked();
    expect(toggleButtonBloodGlucose).toBeChecked();
    expect(toggleButtonInsulinDosage).toBeChecked();
    expect(toggleButtonMood).toBeChecked();
  });

  test("Display's error message if notification permissions is not granted in browser when trying to save preferences for user", () => {
    // Mock handlePopUp function
    const mockHandlePopUp = jest.fn();
    useProp.mockReturnValue({ handlePopUp: mockHandlePopUp });
    // Mock the notification object to have default permission and return default when permission is requested
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("default"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });
    render(<NotificationPage />);
    const button = screen.getByText("Save");
    fireEvent.click(button);
    // Expect that handlePopUp was called with specific parameters
    expect(mockHandlePopUp).toHaveBeenCalledWith(
      "error",
      "Please enable browser notifications before changing any of the preference settings"
    );
    expect(mockRouter).toHaveBeenCalled();
  });

  test("Routes to settings page on button click", () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(<NotificationPage />);
    const backButton = screen.getByText("Push Notifications");

    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/settings");
  });
});

// Assume the code is in a component named AlertComponent
describe("AlertComponent", () => {
  test("Renders success alert on successful update", async () => {
    updateNotificationPreference.mockResolvedValueOnce({ status: "success" });

    render(<NotificationPage />);

    // Mock the notification object to have default permission and return granted when permission is requested
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "granted",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });
    const toggleButtonSubscription =
      screen.getByLabelText("SubscriptionSwitch");
    fireEvent.click(toggleButtonSubscription);

    const button = screen.getByText("Save");
    fireEvent.click(button);
    await waitFor(() => {
      expect(updateNotificationPreference).toHaveBeenCalled();
    });

    // Ensure that the success alert is shown
    expect(screen.getByText("Preference saved!")).toBeInTheDocument();

    // Simulate closing the success alert
    fireEvent.click(screen.getByLabelText("Close"));

    // Check that the success alert is closed by verifying its absence
    expect(screen.queryByText("Preference saved!")).toBeNull();
  });

  test("Renders error alert on update failure", async () => {
    updateNotificationPreference.mockRejectedValueOnce(new Error("Failed"));

    render(<NotificationPage />);

    // Mock the notification object to have default permission and return granted when permission is requested
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "granted",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    const toggleButtonSubscription =
      screen.getByLabelText("SubscriptionSwitch");
    fireEvent.click(toggleButtonSubscription);

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateNotificationPreference).toHaveBeenCalled();
    });

    // Ensure that the error alert is shown
    expect(screen.getByText("Preference failed to save!")).toBeInTheDocument();

    // Simulate closing the error alert
    fireEvent.click(screen.getByLabelText("Close"));

    // Check that the error alert is closed by verifying its absence
    expect(screen.queryByText("Preference failed to save!")).toBeNull();
  });
});

describe("Notification Page useEffect", () => {
  let mockController;
  let mockServiceWorker;
  let mockRegistration;

  beforeEach(() => {
    mockController = {
      postMessage: jest.fn(), // Mock the postMessage method
    };

    mockServiceWorker = {
      controller: mockController,
    };

    mockRegistration = {
      active: mockServiceWorker,
    };
  });
  test("fetchNotificationPreference GET request succeeds and updates preference when notification permission is default or denied", async () => {
    // Mock the Notification API in the window object
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("default"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    const fakeData = {
      data: {
        permissionGranted: false,
        activityReminders: false,
        medicationReminders: false,
        appointmentReminders: false,
        foodIntakeReminders: false,
        glucoseMeasurementReminders: false,
        insulinDosageReminders: false,
        moodReminders: false,
      },
    };
    getNotificationPreference.mockResolvedValue(fakeData);
    updateNotificationPreference.mockResolvedValue(fakeData);

    await act(async () => {
      render(<NotificationPage />);
    });

    await waitFor(() => {
      expect(getNotificationPreference).toHaveBeenCalled();
    });

    const toggleButtonSubscription =
      screen.getByLabelText("SubscriptionSwitch");
    const toggleButtonActvity = screen.getByLabelText("ActvitySwitch");
    const toggleButtonMedication = screen.getByLabelText("MedicationSwitch");
    const toggleButtonAppointment = screen.getByLabelText("AppointmentSwitch");
    const toggleButtonFoodIntake = screen.getByLabelText("FoodIntakeSwitch");
    const toggleButtonBloodGlucose =
      screen.getByLabelText("BloodGlucoseSwitch");
    const toggleButtonInsulinDosage = screen.getByLabelText(
      "InsulinInjectionSwitch"
    );
    const toggleButtonMood = screen.getByLabelText("MoodSwitch");
    expect(toggleButtonSubscription).not.toBeChecked();
    expect(toggleButtonActvity).not.toBeChecked();
    expect(toggleButtonMedication).not.toBeChecked();
    expect(toggleButtonAppointment).not.toBeChecked();
    expect(toggleButtonFoodIntake).not.toBeChecked();
    expect(toggleButtonBloodGlucose).not.toBeChecked();
    expect(toggleButtonInsulinDosage).not.toBeChecked();
    expect(toggleButtonMood).not.toBeChecked();

    // Assert that updateNotificationPreference was called
    await waitFor(() => {
      expect(updateNotificationPreference).toHaveBeenCalled();
    });
  });

  test("fetchNotificationPreference GET request fails and creates preferences for user when notification permission is default or denied", async () => {
    // Mock the Notification API in the window object
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("default"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    const fakeData = {
      data: {
        permissionGranted: false,
        activityReminders: false,
        medicationReminders: false,
        appointmentReminders: false,
        foodIntakeReminders: false,
        glucoseMeasurementReminders: false,
        insulinDosageReminders: false,
        moodReminders: false,
      },
    };

    createNotificationPreference.mockResolvedValue(fakeData);

    // Mock error
    const mockError = new Error("Test error message");

    // Simulating an error in fetch by rejecting the promise
    global.fetch = jest.fn().mockRejectedValue(mockError);
    process.env.NEXT_PUBLIC_API_URL = "https://example.com";

    // Mock rejected value for getNotificationPreference
    getNotificationPreference.mockRejectedValue(mockError);

    // Render page
    await act(async () => {
      render(<NotificationPage />);
    });

    // Assert that getNotificationPreference and createNotificationPreference was called

    await waitFor(() => {
      expect(getNotificationPreference).toHaveBeenCalled();
      expect(createNotificationPreference).toHaveBeenCalled();
    });
  });

  test("fetchNotificationPreference GET request fails and creates request fails when preferences for user when notification permission is default or denied", async () => {
    // Mock the Notification API in the window object
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("default"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    const fakeData = {
      data: {
        permissionGranted: false,
        activityReminders: false,
        medicationReminders: false,
        appointmentReminders: false,
        foodIntakeReminders: false,
        glucoseMeasurementReminders: false,
        insulinDosageReminders: false,
        moodReminders: false,
      },
    };

    // Mock error
    const mockError = new Error("Test error message");

    // Simulating an error in fetch by rejecting the promise
    global.fetch = jest.fn().mockRejectedValue(mockError);
    process.env.NEXT_PUBLIC_API_URL = "https://example.com";

    // Mock rejected value for getNotificationPreference and createNotificationPreference
    getNotificationPreference.mockRejectedValue(mockError);
    createNotificationPreference.mockRejectedValue(mockError);

    // Render page
    await act(async () => {
      render(<NotificationPage />);
    });

    // Assert that getNotificationPreference and createNotificationPreference was called
    await waitFor(() => {
      expect(getNotificationPreference).toHaveBeenCalled();
      expect(createNotificationPreference).toHaveBeenCalled();
    });

    expect(logger.error).toHaveBeenCalledWith(
      "Error creating notification preference for user:",
      mockError
    );
  });

  test("fetchNotificationPreference update function fails when notification permission is default or denied", async () => {
    // Mock the Notification API in the window object
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("default"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    // Mock error
    const mockError = new Error("Test error message");

    const currentUser = {
      uid: "testUID",
      getIdToken: jest.fn().mockResolvedValue("testToken"),
    };

    // Simulating an error in fetch by rejecting the promise
    global.fetch = jest.fn().mockRejectedValue(mockError);
    process.env.NEXT_PUBLIC_API_URL = "https://example.com";

    const fakeData = {
      data: {
        permissionGranted: false,
        activityReminders: false,
        medicationReminders: false,
        appointmentReminders: false,
        foodIntakeReminders: false,
        glucoseMeasurementReminders: false,
        insulinDosageReminders: false,
        moodReminders: false,
      },
    };
    getNotificationPreference.mockResolvedValue(fakeData);
    updateNotificationPreference.mockRejectedValue(mockError);

    await act(async () => {
      render(<NotificationPage />);
    });

    const toggleButtonSubscription =
      screen.getByLabelText("SubscriptionSwitch");
    const toggleButtonActvity = screen.getByLabelText("ActvitySwitch");
    const toggleButtonMedication = screen.getByLabelText("MedicationSwitch");
    const toggleButtonAppointment = screen.getByLabelText("AppointmentSwitch");
    const toggleButtonFoodIntake = screen.getByLabelText("FoodIntakeSwitch");
    const toggleButtonBloodGlucose =
      screen.getByLabelText("BloodGlucoseSwitch");
    const toggleButtonInsulinDosage = screen.getByLabelText(
      "InsulinInjectionSwitch"
    );
    expect(toggleButtonSubscription).not.toBeChecked();
    expect(toggleButtonActvity).not.toBeChecked();
    expect(toggleButtonMedication).not.toBeChecked();
    expect(toggleButtonAppointment).not.toBeChecked();
    expect(toggleButtonFoodIntake).not.toBeChecked();
    expect(toggleButtonBloodGlucose).not.toBeChecked();
    expect(toggleButtonInsulinDosage).not.toBeChecked();

    // Assert that updateNotificationPreference was called
    expect(updateNotificationPreference).toHaveBeenCalled();

    expect(logger.error).toHaveBeenCalledWith(
      "Error updating notification preference for user:",
      mockError
    );
  });

  test("fetchNotificationPreference fetches and sets user preference when notification permission is set to granted", async () => {
    // Mock the service worker to be available
    Object.defineProperty(window.navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration), // Mock the getRegistration method
        controller: mockController, // Ensure the controller is available directly in navigator.serviceWorker
      },
      writable: true,
    });

    // Mock the Notification API in the window object
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "granted",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    // Mock response data
    const mockNotificationData = {
      data: {
        permissionGranted: false,
        activityReminders: true,
        medicationReminders: true,
        appointmentReminders: true,
        foodIntakeReminders: true,
        glucoseMeasurementReminders: true,
        insulinDosageReminders: true,
        moodReminders: true,
      },
    };

    // Mock the getNotificationPreference function to return the mock data
    getNotificationPreference.mockResolvedValue(mockNotificationData);

    await act(async () => {
      render(<NotificationPage />);
    });

    // Assert that getNotificationPreference was called
    await waitFor(() => {
      expect(getNotificationPreference).toHaveBeenCalled();
    });

    expect(logger.info).toHaveBeenCalledWith(
      "Notification preference information all set!"
    );

    // Expect that postMessage was called with specific parameters
    expect(mockController.postMessage).toHaveBeenCalledWith({
      action: "subscribeToPush",
    });

    await waitFor(() => {
      // Check if the toggles are checked based on the mock data
      const toggleButtonSubscription =
        screen.getByLabelText("SubscriptionSwitch");
      const toggleButtonActvity = screen.getByLabelText("ActvitySwitch");
      const toggleButtonMedication = screen.getByLabelText("MedicationSwitch");
      const toggleButtonAppointment =
        screen.getByLabelText("AppointmentSwitch");
      const toggleButtonFoodIntake = screen.getByLabelText("FoodIntakeSwitch");
      const toggleButtonBloodGlucose =
        screen.getByLabelText("BloodGlucoseSwitch");
      const toggleButtonInsulinDosage = screen.getByLabelText(
        "InsulinInjectionSwitch"
      );
      const toggleButtonMood = screen.getByLabelText("MoodSwitch");
      expect(toggleButtonSubscription).toBeChecked();
      expect(toggleButtonActvity).toBeChecked();
      expect(toggleButtonMedication).toBeChecked();
      expect(toggleButtonAppointment).toBeChecked();
      expect(toggleButtonFoodIntake).toBeChecked();
      expect(toggleButtonBloodGlucose).toBeChecked();
      expect(toggleButtonInsulinDosage).toBeChecked();
      expect(toggleButtonMood).toBeChecked();
    });
  });

  test("fetchNotificationPreference fetch fails and post succeeds for user preference when notification permission is set to granted", async () => {
    // Mock the service worker to be available
    Object.defineProperty(window.navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration), // Mock the getRegistration method
        controller: mockController, // Ensure the controller is available directly in navigator.serviceWorker
      },
      writable: true,
    });

    // Mock the Notification API in the window object
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "granted",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    // Mock response data
    const mockNotificationData = {
      data: {
        permissionGranted: false,
        activityReminders: true,
        medicationReminders: true,
        appointmentReminders: true,
        foodIntakeReminders: true,
        glucoseMeasurementReminders: true,
        insulinDosageReminders: true,
        moodReminders: false,
      },
    };

    getNotificationPreference.mockRejectedValueOnce(new Error("Failed"));
    createNotificationPreference.mockResolvedValue(mockNotificationData);

    await act(async () => {
      render(<NotificationPage />);
    });

    // Assert that getNotificationPreference was called
    expect(getNotificationPreference).toHaveBeenCalled();

    // Assert that createNotificationPreference was attempted
    expect(createNotificationPreference).toHaveBeenCalled();

    // Expect that postMessage was called with specific parameters
    expect(mockController.postMessage).toHaveBeenCalledWith({
      action: "subscribeToPush",
    });
  });

  test("fetchNotificationPreference fetch and post fails for user preference when notification permission is set to granted", async () => {
    // Mock the Notification API in the window object
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "granted",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });
    getNotificationPreference.mockRejectedValueOnce(new Error("Failed"));
    createNotificationPreference.mockRejectedValueOnce(new Error("Failed"));

    await act(async () => {
      render(<NotificationPage />);
    });

    // Assert that getNotificationPreference was called
    expect(getNotificationPreference).toHaveBeenCalled();

    // Assert that createNotificationPreference was attempted
    expect(createNotificationPreference).toHaveBeenCalled();
  });
});
