import { APPOINTMENT_TABLE_HEADER } from '@/constants/menu'
import React from 'react'
import { DataTable } from '../table'
import { TableCell, TableRow } from '../ui/table'
import { getMonthName } from '@/lib/utils'
import { CardDescription } from '../ui/card'

type Props = {
  bookings:
    | {
        Customer: {
          Domain: {
            name: string
          } | null
        } | null
        id: string
        email: string
        domainId: string | null
        date: Date
        slot: string
        createdAt: Date
      }[]
    | undefined
}

const AllAppointments = ({ bookings }: Props) => {
  return (
    <DataTable headers={APPOINTMENT_TABLE_HEADER}>
      {bookings && bookings.length > 0 ? (
        bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>{booking.email}</TableCell>
            <TableCell>
              <div>
                {getMonthName(new Date(booking.date).getMonth())} {new Date(booking.date).getDate()}{' '}
                {new Date(booking.date).getFullYear()}
              </div>
              <div className="uppercase">{booking.slot}</div>
            </TableCell>
            <TableCell>
              <div>
                {getMonthName(new Date(booking.createdAt).getMonth())}{' '}
                {new Date(booking.createdAt).getDate()} {new Date(booking.createdAt).getFullYear()}
              </div>
              <div>
                {new Date(booking.createdAt).getHours()} {new Date(booking.createdAt).getMinutes()}{' '}
                {new Date(booking.createdAt).getHours() > 12 ? 'PM' : 'AM'}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {booking.Customer?.Domain?.name}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <CardDescription>No Appointments</CardDescription>
      )}
    </DataTable>
  )
}

export default AllAppointments
