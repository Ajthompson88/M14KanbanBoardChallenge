import { TicketData } from '../interfaces/TicketData.js';
import { ApiMessage } from '../interfaces/ApiMessage.js';
import Auth from '../utils/auth.js';

const retrieveTickets = async () => {
  try {
    const response = await fetch(
      '/api/tickets/',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );
    const data = await response.json();

    if(!response.ok) {
      throw new Error('invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return [];
  }
};

const retrieveTicket = async (id: number | null): Promise<TicketData> => {
  try {
    const response = await fetch(
      `/api/tickets/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    );

    const data = await response.json();

    if(!response.ok) {
      throw new Error('Could not invalid API response, check network tab!');
    }
    return data;
  } catch (err) {
    console.log('Error from data retrieval: ', err);
    return Promise.reject('Could not fetch singular ticket');
  }
}

export const createTicket = async (ticket: TicketData): Promise<TicketData> => {
  try {
   const response = await fetch(
      '/api/tickets/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify(ticket)
      })
      const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

const updateTicket = async (ticketId: number, body: TicketData): Promise<TicketData> => {
  try {
    const response = await fetch(
      `/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        },
        body: JSON.stringify(body)
      }
    )
    const data = await response.json();

    if(!response.ok) {
      throw new Error('invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.error('Update did not work', err);
    return Promise.reject('Update did not work');
  }
};

const deleteTicket = async (ticketId: number): Promise<ApiMessage> => {
  try {
    const response = await fetch(
      `/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Auth.getToken()}`
        }
      }
    )
    const data = await response.json();

    if(!response.ok) {
      throw new Error('invalid API response, check network tab!');
    }

    return data;
  } catch (err) {
    console.error('Error in deleting ticket', err);
    return Promise.reject('Could not delete ticket');
  }
};


export { deleteTicket, retrieveTickets, retrieveTicket, updateTicket};
