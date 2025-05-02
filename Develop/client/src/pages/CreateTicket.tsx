import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI'; // Ensure this function is implemented correctly
import { TicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';
import { retrieveUsers } from '../api/userAPI'; // Ensure this function fetches users correctly

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<TicketData | undefined>({
    id: 0,
    name: '',
    description: '',
    status: 'Todo',
    assignedUserId: 1,
    assignedUser: null,
  });

  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[] | undefined>([]);

  const getAllUsers = async () => {
    try {
      const data = await retrieveUsers(); // Fetch users from the backend
      setUsers(data);
    } catch (err) {
      console.error('Failed to retrieve user info', err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newTicket) {
      try {
        const data = await createTicket(newTicket); // Send the ticket to the backend
        console.log('Ticket created:', data);
        navigate('/'); // Navigate back to the Kanban board
      } catch (error) {
        console.error('Error creating ticket:', error);
      }
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Assigned User ID: ${value}`); // Debugging log
    setNewTicket((prev) => (prev ? { ...prev, [name]: Number(value) } : undefined));
  };

  return (
    <>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Create Ticket</h1>
          <label htmlFor="tName">Ticket Name</label>
          <textarea
            id="tName"
            name="name"
            value={newTicket?.name || ''}
            onChange={handleTextAreaChange}
          />
          <label htmlFor="tStatus">Ticket Status</label>
          <select
            name="status"
            id="tStatus"
            value={newTicket?.status || ''}
            onChange={handleTextChange}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <label htmlFor="tDescription">Ticket Description</label>
          <textarea
            id="tDescription"
            name="description"
            value={newTicket?.description || ''}
            onChange={handleTextAreaChange}
          />
          <label htmlFor="tUserId">User's ID</label>
          <select
            name="assignedUserId"
            value={newTicket?.assignedUserId || ''}
            onChange={handleUserChange}
          >
            {users &&
              users
                .filter((user) => user.id !== null)
                .map((user) => (
                  <option key={user.id} value={user.id as number}>
                    {user.username}
                  </option>
                ))}
          </select>
          <button type="submit">Submit Form</button>
        </form>
      </div>
    </>
  );
};

export default CreateTicket;
