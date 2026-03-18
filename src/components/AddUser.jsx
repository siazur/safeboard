import './AddUser.css';

export default function AddUser({
  show,
  onClose,
  onSave,
  newName,
  setNewName,
  newRole,
  setNewRole,
  newCabin,
  setNewCabin,
  newGroup,
  setNewGroup,
  newStatus,
  setNewStatus
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Добавить</h2>
        
        <input
          placeholder="Имя"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="modal-input"
        />
        
        <input
          placeholder="Роль"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="modal-input"
        />
        
        <input
          placeholder="Каюта"
          value={newCabin}
          onChange={(e) => setNewCabin(e.target.value)}
          className="modal-input"
        />
        
        <select
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          className="modal-select"
        >
          <option value="Гости">Гости</option>
          <option value="Капитанская служба">Капитанская служба</option>
          <option value="Кухня">Кухня</option>
          <option value="Уборка">Уборка</option>
          <option value="Техническая служба">Техническая служба</option>
          <option value="Анимация">Анимация</option>
          <option value="Медицина">Медицина</option>
        </select>
        
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="modal-select"
        >
          <option value="На борту">На борту</option>
          <option value="На берегу">На берегу</option>
          <option value="На экскурсии">На экскурсии</option>
        </select>
        
        <div className="modal-buttons">
          <button onClick={onSave} className="modal-save">
            Сохранить
          </button>
          <button onClick={onClose} className="modal-cancel">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}