"use client";
import FormInput from "@/app/components/FormInput";
import FormLabel from "@/app/components/FormLabel";
import SpanHeader from "@/app/components/SpanHeader";
import { formatDateYearMonthDate } from "@/app/helpers/utils/datetimeformat";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { useAuth } from "../../../../contexts/AuthContext";
import { useProp } from "../../../../contexts/PropContext";
import {
  getGlucoseJournal,
  updateGlucoseJournal,
} from "../../../../http/diabeticJournalAPI";

export default function EditGlucoseJournal({
  params: { glucoseJournal },
}: {
  params: { glucoseJournal: string };
}) {
  const logger = require("../../../../../logger");
  const { user } = useAuth();
  const router = useRouter();
  const [glucose, setglucose] = useState<any>(null);
  const { handlePopUp } = useProp();

  async function fetchGlucoseJournal() {
    try {
      const result = await getGlucoseJournal(glucoseJournal);
      logger.info("Glucose journal entry retrieved:", result);
      setglucose(result.data);
    } catch (error) {
      handlePopUp("error", "Error retrieving glucose journal entry:");
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login");
      logger.warn("User not found.");
      alert("User not found.");
    }
    if (user) {
      setTimeout(() => {
        fetchGlucoseJournal();
      }, 1000);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      date: "",
      mealTime: "",
      bloodGlucose: 0.0 as any,
      unit: "",
      notes: "",
    },

    onSubmit: async (values) => {
      try {
        const userId = user?.uid || "";
        const data = {
          date: values.date,
          mealTime: values.mealTime,
          bloodGlucose: values.bloodGlucose,
          unit: values.unit,
          notes: values.notes,
        };
        const result = await updateGlucoseJournal(glucoseJournal, data).then(
          (result) => {
            router.push(
              `/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}`
            );
          }
        );
        logger.info("Glucose journal entry updated:", result);
      } catch (error) {
        handlePopUp("error", "Error updating glucose journal entry:");
      }
    },
  });

  useEffect(() => {
    const { setValues } = formik;
    setValues({
      date: formatDateYearMonthDate(glucose?.date),
      mealTime: glucose?.mealTime,
      bloodGlucose: glucose?.bloodGlucose,
      unit: glucose?.unit,
      notes: glucose?.notes,
    });
  }, [glucose]);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <SpanHeader
        onClick={() =>
          router.push(
            `/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}`
          )
        }
        headerText="Edit The Glucose Measurement"
      ></SpanHeader>
      <form
        className="rounded-3xl bg-white flex flex-col mb-8 w-full md:max-w-[800px] md:min-h-[550px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
        onSubmit={formik.handleSubmit}
      >
        <div className="mt-3 mb-3">
          <FormLabel htmlFor={"date"} label={"Date"}></FormLabel>
          <Input
            name="date"
            id="date"
            type="date"
            style={{ width: "100%" }}
            onChange={formik.handleChange}
            value={formik.values.date}
            onBlur={formik.handleBlur}
            required={true}
          />
          {formik.touched.date && !formik.values.date && (
            <p className="text-red text-[14px]">
              This field can't be left empty.
            </p>
          )}{" "}
        </div>

        <div className="mt-3">
          <FormLabel htmlFor={"mealTime"} label={"Meal Time"}></FormLabel>
          <select
            className="text-darkgrey"
            name="mealTime"
            id="mealTime"
            style={{
              width: "100%",
              border: "1px solid #DBE2EA", // Border style
              borderRadius: "5px",
              marginTop: "5px",
              height: "50px",
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mealTime}
          >
            <option className="text-darkgrey" value="">
              Choose one
            </option>
            <option className="text-darkgrey" value="Before breakfast">
              Before breakfast
            </option>
            <option className="text-darkgrey" value="30min after breakfast">
              30min after breakfast
            </option>
            <option className="text-darkgrey" value="2hrs after breakfast">
              2hrs after breakfast
            </option>
            <option className="text-darkgrey" value="Before lunch">
              Before lunch
            </option>
            <option className="text-darkgrey" value="30min after lunch">
              30min after lunch
            </option>
            <option className="text-darkgrey" value="2hrs after lunch">
              2hrs after lunch
            </option>
            <option className="text-darkgrey" value="Before dinner">
              Before dinner
            </option>
            <option className="text-darkgrey" value="30min after dinner">
              30min after dinner
            </option>
            <option className="text-darkgrey" value="2hrs after dinner">
              2hrs after dinner
            </option>
            <option className="text-darkgrey" value="Bedtime">
              Bedtime
            </option>
            <option className="text-darkgrey" value="Night">
              Night
            </option>
            <option className="text-darkgrey" value="Other">
              Other
            </option>
          </select>

          {formik.touched.mealTime && !formik.values.mealTime && (
            <p className="text-red text-[14px]">
              This field can't be left empty.
            </p>
          )}
        </div>

        <div className="flex">
          <div className="mt-3">
            <FormLabel
              htmlFor={"bloodGlucose"}
              label={"Blood Glucose"}
            ></FormLabel>
            <Input
              name="bloodGlucose"
              id="bloodGlucose"
              type="number"
              style={{ width: "75%", marginTop: "2px", height: "50px" }}
              onChange={formik.handleChange}
              value={formik.values.bloodGlucose}
              onBlur={formik.handleBlur}
            />
            {/* Check if the field is touched */}
            {formik.touched.bloodGlucose &&
              // Check if the field is empty
              ((!formik.values.bloodGlucose && (
                <p className="text-red text-[14px]">
                  This field can't be left empty or zero.
                </p>
              )) ||
                // Check if the field is less than or equal to zero
                (formik.values.bloodGlucose <= 0 && (
                  <p className="text-red text-[14px]">
                    You can't enter a negative glucose or a glucose of zero.
                  </p>
                )))}
          </div>

          <div
            className="mt-3  ml-1"
            style={{
              width: "50%",
              marginLeft: "2px;",
            }}
          >
            <FormLabel htmlFor={"unit"} label={"Unit"}></FormLabel>
            <select
              className="text-darkgrey"
              name="unit"
              id="unit"
              style={{
                width: "100%",
                border: "1px solid #DBE2EA", // Border style
                borderRadius: "5px",
                marginTop: "2px",
                height: "50px",
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.unit}
            >
              <option className="text-darkgrey" value="">
                Choose one
              </option>
              <option className="text-darkgrey" value="mg/dL">
                mg/dL
              </option>
              <option className="text-darkgrey" value="mmol/L">
                mmol/L
              </option>
              <option className="text-darkgrey" value="other">
                Other
              </option>
            </select>
            {formik.touched.unit && !formik.values.unit && (
              <p className="text-red text-[14px]">
                This field can't be left empty.
              </p>
            )}
          </div>
        </div>

        <FormInput
          label="Notes"
          onChange={formik.handleChange}
          value={formik.values.notes}
          onBlur={formik.handleBlur}
        ></FormInput>

        <div className="mt-10 pb-4 space-x-2 self-center">
          <Button
            type="button"
            text="Cancel"
            style={{
              width: "140px",
              backgroundColor: "var(--Red, #FF7171)",
            }}
            onClick={() =>
              router.push(
                `/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}`
              )
            }
          />

          <Button
            type="submit"
            text="Submit"
            disabled={
              !(formik.isValid && formik.dirty) || // Check if the form is valid and dirty
              formik.values.bloodGlucose === 0 || // Check if  Blood Glucose is zero
              formik.values.bloodGlucose < 0 || // Check if  Blood Glucose is less than  zero
              !formik.values.unit || // Check if unit is missing or empty
              !formik.values.date || // Check if date is missing or empty
              !formik.values.mealTime // Check if time is missing or empty
            }
            style={{ width: "140px" }}
            onClick={() =>
              router.push(
                `/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}`
              )
            }
          />
        </div>
      </form>
    </div>
  );
}
