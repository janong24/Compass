'use client';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import IconButton from '../components/IconButton';
import { useState } from 'react';
import CardFolder from '../components/CardFolder';

export default function GetMedVaultPage() {
  const router = useRouter();
  const [isExportDisabled, setIsExportDisabled] = useState(false);
  const [data, setData] = useState([]);

  const cardData = [
    { icon: '/Upload.svg', name: 'Dr. Bellamy N', text: 'Viralogy' },
    { icon: '/Upload.svg', name: 'Dr. Smith', text: 'Immunology' },
    { icon: '/Upload.svg', name: 'Dr. Johnson', text: 'Pathology' },
    { icon: '/Upload.svg', name: 'Dr. Anderson', text: 'Microbiology' },
    { icon: '/Upload.svg', name: 'Dr. Williams', text: 'Epidemiology' },
    { icon: '/Upload.svg', name: 'Dr. Brown', text: 'Genetics' },
  ];

  return (
    <div className="bg-eggshell h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push('/health')}>
          <Header headerText="MedVault"></Header>
        </button>
      </span>

      <div className="rounded-3xl flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4">
        <div className="flex justify-between items-center">
          <div>
            <IconButton
              type="button"
              icon="/Upload.svg"
              outlined={true}
              text="Export Data"
              style={{ width: '120px', fontSize: '14px' }}
              disabled={isExportDisabled}
            />
          </div>
          <div>
            <IconButton
              type="button"
              icon="/Add.svg"
              text="Add Folder"
              style={{
                width: '120px',
                fontSize: '14px',
                float: 'right',
              }}
              onClick={() => router.push(`/createMedVault`)}
            />
          </div>
        </div>
        {data ? (
          <div className="grid grid-cols-2 gap-4 mt-4 mb-24">
            {cardData.map((data, index) => (
              <CardFolder
                key={index}
                icon={data.icon}
                name={data.name}
                text={data.text}
              />
            ))}
          </div>
        ) : (
          // Render this if data doesn't exist
          <div>
            <img
              src="/compass-removebg.png"
              alt="Logo"
              className="smallImage m-auto"
              width={250}
              height={250}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <div
              className="bg-white rounded-lg p-4 shadow-xl flex items-center justify-center cursor-pointer"
              onClick={() => {
                // Handle button click action here
              }}
            >
              <div className="text-center flex flex-col items-center">
                <img src="/Download.svg" alt="Download" className="w-12 h-12" />
                <h3 className="font-semibold text-lg text-darkgrey">
                  Import Data
                </h3>
                <p className="text-sm text-darkgrey mt-4">
                  Import previously exported data or Add Folder
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
