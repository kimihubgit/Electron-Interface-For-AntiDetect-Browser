import React, { useState } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import GroupsHeader from './components/GroupsHeader';
import GroupCard from './components/GroupCard';
import QuickAddGroupCard from './components/QuickAddGroupCard';
import EmptyGroupsState from './components/EmptyGroupsState';
import GroupFormModal from './modals/GroupFormModal';
import DeleteGroupConfirmModal from './modals/DeleteGroupConfirmModal';

export default function GroupsPage() {
  const { 
    profiles = [], 
    customGroups = [], 
    addGroup, 
    editGroup, 
    deleteGroup, 
    setActiveTab, 
    setSelectedGroup,
    activeGroupModal,
    setActiveGroupModal
  } = useBrowser();

  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState(null);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setActiveGroupModal({ mode: 'create' });
  };

  // Open Edit Modal
  const handleOpenEditModal = (group, e) => {
    e?.stopPropagation();
    setActiveGroupModal({ mode: 'edit', group });
  };

  // Close Modal
  const handleCloseModal = () => {
    setActiveGroupModal(null);
  };

  // Submit Form
  const handleSubmitForm = ({ name, desc, color, mode, group }) => {
    if (mode === 'create') {
      const result = addGroup({ name, desc, color });
      if (!result) {
        return `Nhóm "${name}" đã tồn tại. Vui lòng chọn tên khác!`;
      }
    } else if (mode === 'edit' && group) {
      const success = editGroup(group.id, { name, desc, color });
      if (!success) {
        return `Tên nhóm "${name}" bị trùng hoặc không hợp lệ!`;
      }
    }

    handleCloseModal();
    return null;
  };

  // Delete Group
  const handleConfirmDelete = () => {
    if (!deleteConfirmGroup) return;
    deleteGroup(deleteConfirmGroup.id);
    setDeleteConfirmGroup(null);
  };

  const handleSelectGroup = (groupName) => {
    setSelectedGroup(groupName);
    setActiveTab('profiles');
  };

  return (
    <div style={{
      padding: '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: '#FAFAFA',
      boxSizing: 'border-box'
    }}>
      {/* 1. HEADER */}
      <GroupsHeader
        totalCount={customGroups.length}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* 2. GROUPS GRID */}
      {customGroups.length === 0 ? (
        <EmptyGroupsState onOpenCreateModal={handleOpenCreateModal} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {customGroups.map((g) => (
            <GroupCard
              key={g.id || g.name}
              group={g}
              profiles={profiles}
              onSelectGroup={handleSelectGroup}
              onEditGroup={handleOpenEditModal}
              onDeleteGroup={setDeleteConfirmGroup}
            />
          ))}

          {/* Quick "+ Thêm nhóm mới" Card */}
          <QuickAddGroupCard onOpenCreateModal={handleOpenCreateModal} />
        </div>
      )}

      {/* 3. CREATE / EDIT MODAL */}
      <GroupFormModal
        activeGroupModal={activeGroupModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
      />

      {/* 4. DELETE CONFIRMATION MODAL */}
      <DeleteGroupConfirmModal
        group={deleteConfirmGroup}
        profiles={profiles}
        onClose={() => setDeleteConfirmGroup(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
