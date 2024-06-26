"use client";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Button from "../components/Button";

export default function InstallInstructions() {
  const router = useRouter();

  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);

  const handleSelectPlatform = (selectedPlatform: "android" | "ios") => {
    setPlatform(selectedPlatform);
  };

  const handleResetPlatform = () => {
    setPlatform(null);
  };

  const Instructions = ({
    platform,
    onBack,
  }: {
    platform: "android" | "ios";
    onBack: () => void;
  }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = 3; // Total number of steps

    const handleNextStep = () => {
      setCurrentStep((prevStep) => (prevStep + 1) % totalSteps);
    };

    const handlePrevStep = () => {
      setCurrentStep((prevStep) => (prevStep - 1 + totalSteps) % totalSteps);
    };

    // Calculate margin based on button visibility
    const buttonMargin =
      currentStep !== 0 && currentStep !== totalSteps - 1 ? "10px" : "";

    return (
      <div className="flex flex-col items-center">
        {/* Image */}
        <div className="">
          <img
            data-testid="instruction-image"
            src={`/${platform}-step${currentStep + 1}.png`}
            alt={`${platform} Instruction ${currentStep + 1}`}
            style={{ width: "300px", height: "600px" }}
          />
        </div>
        {/* Instructions */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex mb-4">
            <p style={{ color: "black", textAlign: "center" }}>
              Follow where the red arrow is pointing to install on your{" "}
              {platform} device
            </p>
          </div>
          {/* Step Navigation Buttons */}
          <div className="flex mb-4">
            <Button
              text="Previous"
              type="submit"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              hidden={currentStep === 0}
              style={{
                height: "30px",
                width: "70px",
                marginRight: buttonMargin,
              }}
            />
            <Button
              text="Next"
              type="submit"
              onClick={handleNextStep}
              disabled={currentStep === totalSteps - 1}
              hidden={currentStep === totalSteps - 1}
              style={{ height: "30px", width: "70px" }}
            />
          </div>
          {/* Back Button */}
          <Button
            type="submit"
            text="Back"
            onClick={onBack}
            style={{ height: "30px", width: "70px" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <div>
        <button onClick={() => router.push("/login")}>
          <Header headerText="Installation Instructions" />
        </button>
      </div>
      <div>
        {/* Platform Selection */}
        {platform === null && (
          <div className="flex flex-col items-center mb-8">
            {/* App Logo */}
            <img
              src="/compass-removebg.png"
              alt="App Logo"
              className="w-16 h-16 mb-4"
              style={{ width: "400px", height: "400px" }}
            />
            {/* Platform Buttons */}
            <div className="flex mb-4" style={{ color: "black" }}>
              Please choose the platform of your choice
            </div>
            {/* Platform Buttons */}
            <div className="flex mb-4">
              <Button
                type="submit"
                text="Android"
                onClick={() => handleSelectPlatform("android")}
                style={{ width: "140px", marginRight: "10px" }}
              />
              <Button
                type="submit"
                text="iOS"
                onClick={() => handleSelectPlatform("ios")}
                style={{ width: "140px", marginLeft: "10px" }}
              />
            </div>
          </div>
        )}

        {/* Platform Instructions */}
        {platform !== null && (
          <Instructions platform={platform} onBack={handleResetPlatform} />
        )}
      </div>
    </div>
  );
}
