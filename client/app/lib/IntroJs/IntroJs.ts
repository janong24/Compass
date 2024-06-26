interface introJsInterface {
    steps: any,
    options: any,
    onExitPath: string

}

export const introductionSteps: introJsInterface = {
    steps: [
    {
        title: "Welcome to Compass!",
        element: '#body',
        intro: "Click next to get started",
        disableInteraction: true
    },
    {
        title: "Welcome to Compass!",
        element: '#sections',
        intro: 'Here are the sections in the home page in which you can navigate to',
        disableInteraction: true
    },
    {
        title: "Welcome to Compass!",
        element:'#nav-bar',
        intro: 'You can navigate through the app using the navigation bar',
        disableInteraction: true
    },
    {
        title: "Let's start off with journals",
        element: '#journals-section',
        intro: 'Click here to view your journals',
        position: 'top',
        disableInteraction: false,
    }
],
    options: {
        doneLabel: 'Go to journals',
        // hideNext: false
    },
    onExitPath: '/journals',
}
export const journalSteps: introJsInterface = {
    steps: [
    {
        title: "Never miss a journal entry!",
        intro: "Lets go to the food intake journal to record your meals",
        position: 'top',
        element: '#food-journal',
        disableInteraction: true,
    },
],
    options: {
        doneLabel: 'Go to food journal',
    },
    onExitPath: '/getFoodJournals',

}

export const foodJournalSteps : introJsInterface = {
    steps: [
        {
            title: 'Food intake journal',
            intro: 'Record your meals here',
        },
        {
            element: '#add-meal',
            title: 'Food intake journal',
            intro: 'Lets add your first meal entry',
            disableInteraction: true,
        }
    ],
options: {
        doneLabel: 'add a meal',
    },

    onExitPath: '/createFoodJournal?intro=true'
}

export const createFoodJournalSteps: introJsInterface = {
    steps: [
        {
            title: 'Create a food journal entry',
            intro: 'These are the fields that you can fill in to create a food journal entry',
            element: '#fields',
            disableInteraction: true,
        },
        {
            title: 'Create a food journal entry',
            intro: 'The fields containing a * are required',
            element: '#required-fields',
            disableInteraction: true,

        },
        {
            title: 'Create a food journal entry',
            intro: 'While the fields without a * are optional',
            element: '#optional-fields',
            disableInteraction: true,
        },
        {
            title: 'Create a food journal entry',
            intro: 'Once done,click here to save your meal',
            element: '#save-meal',
            disableInteraction: true,
        }
    ],
    options: {
        doneLabel: 'Track first meal!',
    },
    onExitPath: '/'
}

export const getFoodJournalSteps: introJsInterface = {
    steps: [
        {
            title: 'Congratulations!',
            intro: 'You have successfully added a meal entry',
        },
        {
            title: 'Food journal',
            intro: 'When having alot of entries, you can use the filter to display recent entries',
            element: '#filter',
            disableInteraction: true,

        },
        {
            title: 'Your all set!',
            intro: 'Feel free to navigate through the app for more features',
        }
    ],
    options: {
        doneLabel: 'Launch Compass',
    },
    onExitPath: '/tpage?intro=false'
}
    