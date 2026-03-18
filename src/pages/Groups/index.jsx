import { useEffect, useMemo, useState } from 'react';
import './Groups.css';

function normalizeGroupName(groupName) {
  const s = String(groupName ?? '').trim();
  return s.length > 0 ? s : 'Без отдела';
}

function isGuestStatus(status) {
  return String(status ?? '').toLowerCase() === 'гость';
}

function isGuestGroup(group) {
  if (!group || !Array.isArray(group.members) || group.members.length === 0) return false;
  const nameIsGuests = String(group.name ?? '').trim().toLowerCase() === 'гости';
  const allMembersGuests = group.members.every((m) => isGuestStatus(m?.status));
  return nameIsGuests || allMembersGuests;
}

export default function Groups() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const groups = useMemo(() => {
    const map = new Map();

    for (const user of users) {
      const groupName = normalizeGroupName(user?.group);
      if (!map.has(groupName)) {
        map.set(groupName, []);
      }
      map.get(groupName).push(user);
    }

    const list = Array.from(map.entries()).map(([name, members]) => {
      const rolesCount = members.reduce((acc, m) => {
        const role = String(m?.role ?? '').trim() || 'Без роли';
        acc[role] = (acc[role] ?? 0) + 1;
        return acc;
      }, {});

      const topRoles = Object.entries(rolesCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      return {
        name,
        members: members.slice().sort((a, b) => String(a?.name ?? '').localeCompare(String(b?.name ?? ''), 'ru')),
        count: members.length,
        topRoles,
      };
    });

    return list.sort((a, b) => {
      const aGuest = isGuestGroup(a);
      const bGuest = isGuestGroup(b);

      if (aGuest === bGuest) {
        return a.name.localeCompare(b.name, 'ru');
      }

      // карточка группы гостей всегда в конце
      return aGuest ? 1 : -1;
    });
  }, [users]);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return groups;

    return groups.filter((g) => {
      if (g.name.toLowerCase().includes(term)) return true;
      return g.members.some((m) => String(m?.name ?? '').toLowerCase().includes(term));
    });
  }, [groups, searchTerm]);

  return (
    <div className="groups-page">
      <div className="groups-header">
        <div>
          <h1>Команда корабля</h1>
        </div>

        <div className="groups-search">
          <input
            type="text"
            placeholder="🔍 Поиск по группе или имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="groups-searchField"
          />
        </div>
      </div>

      <div className="groups-grid">
        {filteredGroups.map((g) => {
          const guestGroup = isGuestGroup(g);

          return (
            <section
              className={`group-card${guestGroup ? ' group-card-guest' : ''}`}
              key={g.name}
            >
              <div className="group-cardHeader">
                <h2 className="group-title">
                  {g.name}
                  {guestGroup && ' (не относятся к команде)'}
                </h2>
                <span className="group-count">{g.count}</span>
              </div>

              {g.topRoles.length > 0 && (
                <div className="group-roles">
                  {g.topRoles.map(([role, cnt]) => (
                    <span key={role} className="group-roleChip">
                      {role} · {cnt}
                    </span>
                  ))}
                </div>
              )}

              <div className="group-members">
                {g.members.length === 0 ? (
                  <div className="group-empty">Пока никого нет</div>
                ) : (
                  <ul className="group-membersList">
                    {g.members
                      .slice()
                      .sort((a, b) => {
                        const aIsGuest = isGuestStatus(a?.status);
                        const bIsGuest = isGuestStatus(b?.status);
                        if (aIsGuest === bIsGuest) {
                          return String(a?.name ?? '').localeCompare(String(b?.name ?? ''), 'ru');
                        }
                        // гости всегда в конце
                        return aIsGuest ? 1 : -1;
                      })
                      .map((m) => {
                        const guest = isGuestStatus(m?.status);
                        return (
                          <li
                            key={m.id ?? `${g.name}-${m.name}`}
                            className={`group-member${guest ? ' group-member-guest' : ''}`}
                          >
                            <span className="group-memberName">{m.name}</span>
                            <span className="group-memberMeta">
                              {m.role ? m.role : 'Без роли'}
                              {m.cabin ? ` · каюта ${m.cabin}` : ''}
                              {guest ? ' · гость' : ''}
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="groups-zero">
          Ничего не найдено по запросу <span className="groups-mono">{searchTerm}</span>.
        </div>
      )}
    </div>
  );
}