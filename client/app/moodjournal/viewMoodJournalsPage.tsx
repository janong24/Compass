'use client';
import Button from '../components/Button';
import { useRouter } from 'next/navigation';
import { deleteMoodJournal, getMoodJournals } from '../http/moodJournalAPI';
import { useEffect, useState } from 'react';
import { formatDate, formatDateYearMonthDate } from '../helpers/utils/datetimeformat';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

export default function ViewMoodJournalsPage() {
  const logger = require('../../logger');
  const { user } = useAuth();
  const [moodJournal, setMoodJournal] = useState<any>();
  const [moodColor, setMoodColor] = useState<any>();
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [highlightedDays, setHighlightedDays] = useState<string[]>([]);

  useEffect(() => {
    if (!user)
      router.push("/login")
  }, [user]);

  useEffect(() => {
    async function fetchMoodJournals() {
      try {
        const userId = user?.uid || '';
        const result = await getMoodJournals();
        logger.info('All mood journal entries retrieved:', result);
        setMoodJournal(result.data);
      } catch (error) {
        logger.error('Error retrieving mood journal entry:', error);
      }
    }
    setTimeout(() => {
      fetchMoodJournals();
    }, 1000);
  }, [user]);

  function setColor(mood: String) {
    switch (mood) {
      case 'awesome':
        return '#14a38b'
      case 'good':
        return '#a5d6a7'
      case 'sad':
        return '#756f86'
      case 'bad':
        return '#f2ac57'
      case 'awful':
        return '#ff7171'
    }
  }

  async function deleteMoodJournals(moodJournalId: string) {
    Swal.fire({
      text: "Are you sure you want to delete this mood journal entry?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        const deleteresult = await deleteMoodJournal(moodJournalId);
        const newData = moodJournal && moodJournal.filter((item: { id: string; }) => item.id != moodJournalId);
        setMoodJournal(newData);
        router.push('/moodjournal');
        Swal.fire({
          title: "Deleted!",
          text: "Your mood journal entry has been deleted.",
          icon: "success"
        });
      }
    });

  }

  const handleClick = (moodJournalID: string) => {
    router.push(`/moodjournal/${moodJournalID}`);
  }

  const handleCalendarClick = () => {
    setShowCalendar(true);
  }

  const handleDailyClick = () => {
    setShowCalendar(false);
  }

  useEffect(() => { 
    let tempDates: string[] = [];
    if (moodJournal) { 
      moodJournal.forEach((item: any) => { 
        tempDates.push(formatDateYearMonthDate(item.date))
      })
      console.log('tempDates', tempDates)
      setHighlightedDays(tempDates)
    }
   
  }, [moodJournal])


  const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },

  }));


  const ServerDay = (props : any) => {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const getMoodForDay = () => {
      const formattedDate = day.format("YYYY-MM-DD");
      const moodEntry = moodJournal.find((entry: any) => formatDateYearMonthDate(entry.date) === formattedDate);
      return moodEntry ? moodEntry.howAreYou : null;
    };
    const mood = getMoodForDay();
    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.includes(day.format("YYYY-MM-DD"));
    
    
    
  const handleClick = () => {
    const formattedDate = day.format('YYYY-MM-DD');
    const moodEntry = moodJournal.find((entry: any) => formatDateYearMonthDate(entry.date) === formattedDate);
    
    if (moodEntry) {
      router.push(`/moodjournal/${moodEntry.id}`);
    }
  };
  
    return (
      <HighlightedDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        style={{
          backgroundColor: isSelected ?  setColor(mood): '#ffffff',
        }}
        selected={isSelected}
        onClick={handleClick} 
      />
    );
  };

   //Order by Date
	const [orderdate, setOrderDate] = useState(false)

	const handleOrderDate = () => {
		setOrderDate(!orderdate)
		if (!orderdate){
			const increasingOrdermoodData = [...moodJournal].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			setMoodJournal(increasingOrdermoodData)
		}
		else{
			const decreasingOrdermoodData = [...moodJournal].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			setMoodJournal(decreasingOrdermoodData)
		}
	}

  return (
    <div className="bg-eggshell min-h-screen flex flex-col w-full">

      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4">
        <button onClick={() => router.push('/journals')}>
          <Header headerText="Mood Journal "></Header>
        </button>
      </span>
      <p className="text-grey font-sans text-[16px] ml-4 mt-2 w-11/12">
        Tracking your mood helps you understand when and what caused your mood to change.
      </p>
      <div
        className="w-11/12 rounded-3xl flex flex-col space-y-4 mt-2 self-center mb-4"
      >
        <div className="flex space-x-2" style={{ padding: '24px 16px 0 16px' }}>
          <Button
            type="button"
            text="Add an item"
            onClick={() => router.push('/moodjournal/addentry')}
            style={{
              width: '100px',
              height: '34px',
              padding: '2px',
              borderRadius: '3px',
              fontSize: '14px'
            }} />
          <Button
            type="button"
            text="Daily"
            onClick={() => handleDailyClick()}
            style={{
              width: '100px',
              height: '34px',
              padding: '2px',
              borderRadius: '3px',
              fontSize: '14px'
            }} />
          <Button
            type="button"
            text="Monthly"
            onClick={() => handleCalendarClick()}
            style={{
              width: '100px',
              height: '34px',
              padding: '2px',
              borderRadius: '3px',
              fontSize: '14px'
            }} />
        </div>
        {!showCalendar &&
          <div className="flex flex-col space-y-2 p-4 text-darkgrey" style={{ overflowY: 'auto', maxHeight: '380px' }}>
            <button onClick={handleOrderDate}>
									{orderdate ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  }
						</button>
            {moodJournal && moodJournal.map((data: any, index: number) => (
              <div
                key={data.id}
                className="flex space-x-2"
              >
                <div className="self-center border border-grey p-2 rounded-lg w-[75px] h-[75px] text-center font-bold text-darkgrey text-[20px]">
                  <p>{formatDate(data.date).substring(0, 3).toUpperCase()}</p>
                  <p>{formatDate(data.date).substring(4, 6).replace(',', '')}</p>
                </div>

                <div className="flex items-center">
                  <div className="h-[20px] w-[10px] flex items-center">
                    <div className="border-b-[25px] border-r-[37.5px] border-t-[25px] border-b-transparent border-t-transparent"
                      style={{ borderColor: 'transparent', borderRightColor: setColor(data.howAreYou) }}>
                    </div>
                  </div>
                  <div className="relative rounded-md p-2 w-[240px] h-[100px] text-white" onClick={() => handleClick(data.id)} style={{ background: setColor(data.howAreYou) }}>
                    <div onClick={() => deleteMoodJournals(data.id)}>
                      <Image
                        src="/icons/greyTrash.svg"
                        alt="Grey-colored Trash icon"
                        width={10}
                        height={10}
                        className="absolute top-2 right-2"
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                    <p className="font-medium">Felt {data.howAreYou}!</p>
                    {data.notes && (
                      <p className="opacity-[0.86] pt-1">{data.notes.length > 55 ? `${data.notes.substring(0, 55)}...` : data.notes}</p>
                    )}

                  </div>
                </div>
              </div>
            ))}

          </div>
        }

        {
          showCalendar &&
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar slotProps={{
                        day: {
                          highlightedDays,
                        },
                }}
                slots={{
                  day: ServerDay,
                }}
                style={{ background: 'white', color: 'black', marginLeft: '12px' }}
              />
            </LocalizationProvider>
        }

        
        <div className="mb-2">&nbsp;</div>
      </div>


    </div>
  )
}