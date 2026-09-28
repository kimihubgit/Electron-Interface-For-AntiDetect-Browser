use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::models::{StartSyncPayload, SyncStatusInfo};

#[derive(Clone)]
pub struct SynchronizerEngine {
    is_syncing: Arc<AtomicBool>,
    master_id: Arc<RwLock<Option<String>>>,
    follower_ids: Arc<RwLock<Vec<String>>>,
    events_count: Arc<AtomicU64>,
}

impl SynchronizerEngine {
    pub fn new() -> Self {
        Self {
            is_syncing: Arc::new(AtomicBool::new(false)),
            master_id: Arc::new(RwLock::new(None)),
            follower_ids: Arc::new(RwLock::new(Vec::new())),
            events_count: Arc::new(AtomicU64::new(0)),
        }
    }

    pub async fn start_sync(&self, payload: StartSyncPayload) -> Result<SyncStatusInfo, String> {
        self.is_syncing.store(true, Ordering::SeqCst);
        {
            let mut master = self.master_id.write().await;
            *master = Some(payload.master_id.clone());
        }
        {
            let mut followers = self.follower_ids.write().await;
            *followers = payload.follower_ids.clone();
        }

        self.events_count.store(0, Ordering::SeqCst);

        Ok(self.get_status().await)
    }

    pub async fn stop_sync(&self) -> SyncStatusInfo {
        self.is_syncing.store(false, Ordering::SeqCst);
        self.get_status().await
    }

    pub async fn get_status(&self) -> SyncStatusInfo {
        let is_sync = self.is_syncing.load(Ordering::SeqCst);
        let master = self.master_id.read().await.clone();
        let followers = self.follower_ids.read().await.len();
        let events = self.events_count.load(Ordering::SeqCst);

        SyncStatusInfo {
            is_syncing: is_sync,
            master_id: master,
            follower_count: followers,
            events_dispatched: events,
        }
    }

    pub fn record_dispatched_event(&self) {
        self.events_count.fetch_add(1, Ordering::Relaxed);
    }
}
