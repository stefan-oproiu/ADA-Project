import {User} from '../dtos/user';

export const USERS: User[] = [
    {
        id: '1',
        fullName: 'Ion Ionescu',
        balance: 2424,
        transactions: [
            {
                id: 1,
                sourceId: '1',
                targetID: '2',
                date: new Date('2021-01-16'),
                amount: 33,
                sourceFullName: 'Ion Ionescu',
                targetFullName: 'Mihai Eminescu'
            },
            {
                id: 1,
                sourceId: '1',
                targetID: '2',
                date: new Date('2021-01-16'),
                amount: 33,
                sourceFullName: 'Mihai Eminescu',
                targetFullName: 'Ion Ionescu'
            },
            {
                id: 1,
                sourceId: '1',
                targetID: '2',
                date: new Date('2021-01-16'),
                amount: 33,
                sourceFullName: 'Ion Ionescu',
                targetFullName: 'Mihai Eminescu'
            }
        ]
    }
];

export const NEW_USERS: User[] = [
    {
        id: '1',
        fullName: 'Ion Ionescu',
        balance: 2424,
        transactions: [
            {
                id: 1,
                sourceId: '1',
                targetID: '2',
                date: new Date('2021-01-16'),
                amount: 33,
                sourceFullName: 'Ion Ionescu',
                targetFullName: 'Mihai Eminescu'
            }
        ]
    }
];


