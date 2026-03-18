import { useState, useEffect, useMemo } from 'react';
import './Users.css';
import AddUser from '../../components/AddUser';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCabin, setNewCabin] = useState('');
  const [newGroup, setNewGroup] = useState('Гости');
  const [newStatus, setNewStatus] = useState('На борту');

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  //обработка клика для сортировки
  const clickSort = (nameSort) => {
    if (nameSort === sortField) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(nameSort);
      setSortDirection('asc');
    }
  }

  // функция добавления пользователя
  const addUser = () => {
    if (!newName || !newRole || !newCabin) {
      alert('Заполните имя, роль и каюту');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: newName,
      role: newRole,
      cabin: newCabin,
      group: newGroup,
      status: newStatus
    };

    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        setUsers([...users, data]);
        setShowModal(false);
        setNewName('');
        setNewRole('');
        setNewCabin('');
        setNewGroup('Гости');
        setNewStatus('На борту');
      });
  }

  //сортировка
  const sorted = useMemo(() => {
    return [...users].sort((a, b) => {
      if (sortDirection === 'asc') {
        if (a[sortField] < b[sortField]) return -1;
        if (a[sortField] > b[sortField]) return 1;
        return 0;
      } else {
        if (a[sortField] > b[sortField]) return -1;
        if (a[sortField] < b[sortField]) return 1;
        return 0;
      }
    });
  }, [users, sortField, sortDirection]);

  const filteredUsers = sorted.filter(user => {
    const name = user.name.toLowerCase();
    const role = user.role.toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || role.includes(term);
  });

  return (
    <div className="users-page">
      <h1>Состав круиза</h1>
      
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="🔍 Поиск по имени или роли..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-field"
        />
        <button 
          onClick={() => setShowModal(true)}
          className="add-button"
        >
          +
        </button>
      </div>

      <AddUser
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={addUser}
        newName={newName}
        setNewName={setNewName}
        newRole={newRole}
        setNewRole={setNewRole}
        newCabin={newCabin}
        setNewCabin={setNewCabin}
        newGroup={newGroup}
        setNewGroup={setNewGroup}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
      />

      <table className="users-table">
        <thead>
          <tr className='user-tr'>
            <th className="user-th" onClick={() => clickSort('name')}>
              Имя {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="user-th" onClick={() => clickSort('role')}>
              Роль {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="user-th" onClick={() => clickSort('cabin')}>
              Каюта {sortField === 'cabin' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="user-th" onClick={() => clickSort('group')}>
              Отдел {sortField === 'group' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="user-th" onClick={() => clickSort('status')}>
              Статус {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="user-th"></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (  
            <tr key={user.id} className='user-tr'>
              <td className="user-td">{user.name}</td>
              <td className="user-td">{user.role}</td>
              <td className="user-td">{user.cabin}</td>
              <td className="user-td">{user.group}</td>
              <td className="user-td">{user.status}</td>
              <td className="user-td">
                <button 
                  onClick={() => {
                    const confirmDelete = window.confirm(`Удалить ${user.name}?`);
                    if (confirmDelete) {
                      fetch(`http://localhost:3001/users/${user.id}`, {
                        method: 'DELETE'
                      })
                        .then(() => {
                          const newUsers = users.filter(u => u.id !== user.id);
                          setUsers(newUsers);
                        });
                    }
                  }}
                  className="delete-btn"
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}