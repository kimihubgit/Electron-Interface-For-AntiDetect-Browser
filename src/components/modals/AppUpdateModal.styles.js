/**
 * Styles for AppUpdateModal Component
 */
export const updateModalStyles = {
  backdrop: (forceUpdate) => ({
    position: 'fixed',
    inset: 0,
    zIndex: 999999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: forceUpdate ? 'rgba(15, 23, 42, 0.65)' : 'rgba(15, 23, 42, 0.35)',
    backdropFilter: 'blur(3px)',
    userSelect: 'none'
  }),

  container: {
    width: '380px',
    maxWidth: '90vw',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)',
    padding: '24px 22px 20px 22px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },

  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },

  iconBox: (status, forceUpdate) => {
    if (status === 'ready') {
      return {
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        backgroundColor: '#ECFDF5',
        color: '#10B981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      };
    }
    return {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      backgroundColor: forceUpdate ? '#FEF2F2' : '#EFF6FF',
      color: forceUpdate ? '#EF4444' : '#2563EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    };
  },

  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A'
  },

  versionText: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: 500
  },

  description: (forceUpdate) => ({
    margin: '0 0 14px 0',
    fontSize: '13px',
    color: forceUpdate ? '#991B1B' : '#475569',
    lineHeight: '1.5'
  }),

  progressContainer: {
    marginBottom: '18px'
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748B',
    fontWeight: 600,
    marginBottom: '6px'
  },

  progressTrack: {
    width: '100%',
    height: '7px',
    backgroundColor: '#E2E8F0',
    borderRadius: '10px',
    overflow: 'hidden'
  },

  progressBar: (progress) => ({
    width: `${progress}%`,
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: '10px',
    transition: 'width 0.25s ease'
  }),

  notesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    padding: '10px 12px',
    marginBottom: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  noteItem: {
    fontSize: '12px',
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },

  noteDot: (forceUpdate) => ({
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: forceUpdate ? '#EF4444' : '#2563EB',
    flexShrink: 0
  }),

  errorBox: {
    padding: '10px 14px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '8px',
    fontSize: '12.5px',
    color: '#991B1B',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px'
  },

  secondaryBtn: {
    padding: '7px 14px',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#FFFFFF',
    color: '#64748B',
    fontSize: '12.5px',
    fontWeight: 500,
    cursor: 'pointer'
  },

  primaryBtn: (forceUpdate) => ({
    flex: forceUpdate ? 1 : 'none',
    padding: '7px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: forceUpdate ? '#DC2626' : '#2563EB',
    color: '#FFFFFF',
    fontSize: '12.5px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  }),

  installBtn: {
    flex: 1,
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  }
};
