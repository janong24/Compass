"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	MdDeleteForever,
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
} from "react-icons/md";
import Swal from "sweetalert2";
import Button from "../components/Button";
import GeneralEntry from "../components/GeneralEntry";
import SpanHeader from "../components/SpanHeader";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import {
	formatDate,
	formatMilitaryTime,
} from "../helpers/utils/datetimeformat";
import {
	deleteO2SaturationJournal,
	getO2SaturationJournals,
} from "../http/oxygenJournalAPI";

export default function GetOxygenJournalsPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();
	const [oxygen, setoxygen] = useState<any>(null);
	const { handlePopUp } = useProp();
	const [selectAll, setSelectAll] = useState(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

	useEffect(() => {
		async function fetchOxygenJournals() {
			try {
				const result = await getO2SaturationJournals();
				logger.info("All Oxygen journals entry retrieved:", result);
				setoxygen(result.data);
			} catch (error) {
				handlePopUp("error", "Error retrieving oxygen journal entry:");
			}
		}
		setTimeout(() => {
			fetchOxygenJournals();
		}, 1000);
	}, [user]);
	const deleteSelectedRows = async () => {
		Swal.fire({
			text: "Are you sure you want to delete this oxygen journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				for (const id of selectedRows) {
					const deleteresult = await deleteO2SaturationJournal(id);
				}

				const newData = oxygen.filter(
					(item: { id: string }) => !selectedRows.includes(item.id)
				);
				setoxygen(newData);
				setSelectedRows([]);

				router.push("/getOxygenJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your oxygen journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	};

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows([]);
		} else {
			const allIds = oxygen.map((item: { id: string }) => item.id);
			setSelectedRows(allIds);
		}
		setSelectAll(!selectAll);
	};

	const handleCheckboxChange = (id: string) => {
		if (selectedRows.includes(id)) {
			setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
		} else {
			setSelectedRows([...selectedRows, id]);
		}
	};
	async function deleteOxygenJournals(oxygenJournalId: string) {
		Swal.fire({
			text: "Are you sure you want to delete this oxygen journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				const deleteresult = await deleteO2SaturationJournal(
					oxygenJournalId
				);
				const newData =
					oxygen &&
					oxygen.filter(
						(item: { id: string }) => item.id != oxygenJournalId
					);
				setoxygen(newData);
				router.push("/getOxygenJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your oxygen journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	}

	const [orderdate, setOrderdate] = useState(false);

	const handleOrderDate = () => {
		setOrderdate(!orderdate);
		if (!orderdate && Array.isArray(oxygen)) {
			const increasingOxygenData = [...oxygen].sort(
				(a, b) =>
					new Date(a.date.substring(0, 10) + "T" + a.time).getTime() -
					new Date(b.date.substring(0, 10) + "T" + b.time).getTime()
			);
			setoxygen(increasingOxygenData);
		} else if (Array.isArray(oxygen)) {
			const decreasingOrderOxygenData = [...oxygen].sort(
				(a, b) =>
					new Date(b.date.substring(0, 10) + "T" + b.time).getTime() -
					new Date(a.date.substring(0, 10) + "T" + a.time).getTime()
			);
			setoxygen(decreasingOrderOxygenData);
		}
	};

	const [orderO2, setOrderO2] = useState(false);

	const handleOrderO2 = () => {
		setOrderO2(!orderO2);
		if (!orderO2) {
			const increasingOxygenData = [...oxygen].sort(
				(a, b) => a.o2sat - b.o2sat
			);
			setoxygen(increasingOxygenData);
		} else {
			const decreasingOrderOxygenData = [...oxygen].sort(
				(a, b) => b.o2sat - a.o2sat
			);
			setoxygen(decreasingOrderOxygenData);
		}
	};
	const [orderPulse, setOrderPulse] = useState(false);

	const handleOrderPulse = () => {
		setOrderPulse(!orderPulse);
		if (!orderPulse) {
			const increasingOxygenData = [...oxygen].sort(
				(a, b) => a.pulse - b.pulse
			);
			setoxygen(increasingOxygenData);
		} else {
			const decreasingOrderOxygenData = [...oxygen].sort(
				(a, b) => b.pulse - a.pulse
			);
			setoxygen(decreasingOrderOxygenData);
		}
	};

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/journals")}
				headerText="Oxygen Journals"></SpanHeader>
			<p className="font-sans text-darkgrey ml-5 text-[14px]">
				With your pulse oximeter, log your observations here in one go!
			</p>
			<br></br>

			{oxygen && (
				<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="flex justify-between items-center">
						<Button
							type="button"
							text="Add an Entry"
							style={{
								width: "120px",
								fontSize: "14px",
								padding: "1px 10px",
							}}
							onClick={() => router.push(`/createOxygenJournal`)}
						/>
					</div>
					<br></br>
					<div
						className="flex"
						style={{ justifyContent: "space-between" }}>
						<div className="flex-2" style={{ marginRight: "8%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								Date/Time
								<button
									onClick={handleOrderDate}
									aria-label="orderDate">
									{orderdate ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>

						<div className="flex-2" style={{ marginRight: "5%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								O<sub>2</sub>
								<button
									onClick={handleOrderO2}
									aria-label="orderO2">
									{orderO2 ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div className="flex-2" style={{ marginRight: "10%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								Pulse
								<button
									onClick={handleOrderPulse}
									aria-label="orderOxygen">
									{orderPulse ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div
							className="flex-2 mt-2"
							style={{ marginRight: "2%" }}>
							<input
								type="checkbox"
								checked={selectAll}
								onChange={handleSelectAll}
							/>
						</div>
					</div>
					{oxygen.map((item: any, index: number) => (
						<div
							key={item.oxygenJournalId}
							className={`flex justify-between items-center mt-3`}
							style={{
								backgroundColor:
									index % 2 === 0 ? "white" : "#DBE2EA",
							}}
							data-testid="oxygen-entry"
							onClick={() =>
								router.push(`/getOxygenJournals/${item.id}`)
							}>
							<GeneralEntry
								value1={`${formatDate(
									item.date
								)} ${formatMilitaryTime(item.time)}`}
								value2={item.o2sat}
								value3={item.pulse}></GeneralEntry>
							<div
								className="flex icons"
								style={{
									marginLeft: "5px",
									marginRight: "5px",
								}}>
								<div className="icon" id="Trash Icon">
									<MdDeleteForever
										style={{
											color: "var(--Red, #FF7171)",
											width: "25px",
											height: "30px",
										}}
										onClick={(event) => {
											event.stopPropagation();
											deleteOxygenJournals(item.id);
										}}
									/>
								</div>
								<div className="flex-1 mt-1">
									<input
										type="checkbox"
										checked={selectedRows.includes(item.id)}
										onClick={(event) => {
											event.stopPropagation();
											handleCheckboxChange(item.id);
										}}
									/>
								</div>
							</div>
						</div>
					))}
					{selectedRows.length > 0 && (
						<div className="mt-5 pb-4 self-center">
							<Button
								type="button"
								text="Delete Selected Rows"
								style={{
									width: "120px",
									fontSize: "14px",
									padding: "1px 10px",
								}}
								onClick={deleteSelectedRows}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
