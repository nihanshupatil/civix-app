import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  // Navigation: 'feed' | 'clips' | 'communities' | 'direct' | 'profile'
  const [activeWindow, setActiveWindow] = useState('feed');

  // National Development Credit System State
  const [userCredits, setUserCredits] = useState(14);
  const [awardedIds, setAwardedIds] = useState([]);

  // Feed Sub-View: 'timeline' (X) | 'visuals' (Instagram)
  const [feedMode, setFeedMode] = useState('timeline');

  // Communities Sub-View Sorter: 'hot' | 'new' | 'top'
  const [communitySort, setCommunitySort] = useState('hot');

  // Direct Message Thread State
  const [activeChat, setActiveChat] = useState(null);
  const [vanishMode, setVanishMode] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'Aarav Mehta', text: 'Did you review the educational curriculum framework draft?', isMe: false, time: '10:14 AM' },
    { id: '2', sender: 'You', text: 'Yes, verifying Section 4 on regional digital literacy access now.', isMe: true, time: '10:16 AM' }
  ]);

  // Feed Posts Data
  const [dispatches, setDispatches] = useState([
    {
      id: 'd1',
      author: 'Prof. S. Ramanathan',
      handle: '@s_ramanathan',
      role: 'Education Pillar Contributor',
      text: 'Published open-source mathematical modules for vernacular medium students (Grades 8-10). Full open problem bank linked below.',
      verifiedAnswer: true,
      likes: 342,
      reposts: 88,
      category: 'EDUCATION & SKILLS'
    },
    {
      id: 'd2',
      author: 'Urban Infra Taskforce',
      handle: '@infra_ward9',
      role: 'Civic Monitor',
      text: 'Hazardous exposed power junction near Old Market cleared. Ward 9 nodal unit verified complete closure of ticket #TK-402.',
      verifiedAnswer: true,
      likes: 512,
      reposts: 120,
      category: 'CIVIC DEVELOPMENT'
    }
  ]);

  // Community Forum Threads Data (Reddit-Style)
  const [threads, setThreads] = useState([
    {
      id: 't1',
      community: 'c/DigitalIndia',
      author: 'dev_kartik',
      flair: 'Technical Guide',
      title: 'How to deploy decentralized UPI fallback terminals in zero-connectivity rural zones',
      upvotes: 420,
      comments: 64,
      isResolvedSolution: true
    },
    {
      id: 't2',
      community: 'c/CivicInfrastructure',
      author: 'priya_m',
      flair: 'Hazard Alert',
      title: 'Stormwater drainage map for Sector 4: Identified three critical drainage blocks',
      upvotes: 289,
      comments: 31,
      isResolvedSolution: false
    }
  ]);

  // Credit Award Handler (+1 Credit per Verified Contribution)
  const handleAwardCredit = (id, targetAuthor) => {
    if (awardedIds.includes(id)) {
      Alert.alert('Already Endorsed', 'You have already verified this contribution.');
      return;
    }
    setAwardedIds([...awardedIds, id]);
    setUserCredits(prev => prev + 1);
    Alert.alert(
      'Credit Point Awarded',
      `+1 National Development Credit granted to ${targetAuthor} for verified educational/civic contribution.`
    );
  };

  // Direct Message Send
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      sender: 'You',
      text: messageInput.trim(),
      isMe: true,
      time: 'Just now'
    };
    setChatMessages([...chatMessages, newMsg]);
    setMessageInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f19" />

      {/* Global Window Container */}
      <View style={styles.mainStage}>

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 1: FEED (X Dispatches + Instagram Visuals)                 */}
        {/* ----------------------------------------------------------------- */}
        {activeWindow === 'feed' && (
          <View style={styles.windowWrapper}>
            <View style={styles.topHeader}>
              <Text style={styles.logoTitle}>CIVIX</Text>
              <View style={styles.feedModeToggle}>
                <TouchableOpacity
                  style={[styles.modeBtn, feedMode === 'timeline' && styles.modeBtnActive]}
                  onPress={() => setFeedMode('timeline')}
                >
                  <Text style={[styles.modeBtnText, feedMode === 'timeline' && styles.modeBtnTextActive]}>Timeline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeBtn, feedMode === 'visuals' && styles.modeBtnActive]}
                  onPress={() => setFeedMode('visuals')}
                >
                  <Text style={[styles.modeBtnText, feedMode === 'visuals' && styles.modeBtnTextActive]}>Visuals</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stories Tray */}
            <View style={styles.storiesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Your Story', 'Ramanathan', 'Ward 9 Ops', 'Priya M.', 'Dr. Varma', 'TechHub'].map((name, i) => (
                  <View key={i} style={styles.storyBubbleWrapper}>
                    <View style={[styles.storyRing, i === 0 && styles.myStoryRing]}>
                      <View style={styles.storyAvatarPlaceholder}>
                        <Text style={styles.storyInitial}>{name.charAt(0)}</Text>
                      </View>
                    </View>
                    <Text style={styles.storyName} numberOfLines={1}>{name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Stream */}
            <FlatList
              data={dispatches}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 90 }}
              renderItem={({ item }) => (
                <View style={styles.feedCard}>
                  <View style={styles.feedHeaderRow}>
                    <View>
                      <Text style={styles.authorName}>{item.author}</Text>
                      <Text style={styles.authorHandle}>{item.handle} • {item.category}</Text>
                    </View>
                    <View style={styles.creditTag}>
                      <Text style={styles.creditTagText}>PRAMĀN VERIFIED</Text>
                    </View>
                  </View>

                  <Text style={styles.feedText}>{item.text}</Text>

                  {feedMode === 'visuals' && (
                    <View style={styles.mockMediaContainer}>
                      <Text style={styles.mockMediaText}>[High-Resolution Verified Photo / Field Proof]</Text>
                    </View>
                  )}

                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionText}>♥ {item.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionText}>⇄ {item.reposts}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.creditActionBtn}
                      onPress={() => handleAwardCredit(item.id, item.author)}
                    >
                      <Text style={styles.creditActionText}>★ +1 Credit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 2: CLIPS (Shorts & Reels Engine)                          */}
        {/* ----------------------------------------------------------------- */}
        {activeWindow === 'clips' && (
          <View style={styles.clipsContainer}>
            <View style={styles.clipsVideoScreen}>
              <Text style={styles.clipWatermark}>CLIPS ENGINE</Text>
              <Text style={styles.clipDescriptionTitle}>Demystifying Semiconductor Fabrication in India</Text>
              <Text style={styles.clipDescriptionSub}>Lecture 04 • Practical guide on micro-lithography labs for engineering students.</Text>

              <View style={styles.clipSideRail}>
                <TouchableOpacity style={styles.clipIconBtn}>
                  <Text style={styles.clipIconText}>♥</Text>
                  <Text style={styles.clipMetricText}>82.4k</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clipIconBtn}>
                  <Text style={styles.clipIconText}>💬</Text>
                  <Text style={styles.clipMetricText}>1.2k</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.clipIconBtn, styles.clipCreditBtn]}
                  onPress={() => handleAwardCredit('clip1', 'Dr. S. Kulkarni')}
                >
                  <Text style={styles.clipIconText}>★</Text>
                  <Text style={styles.clipCreditMetric}>+1 Point</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 3: COMMUNITIES (Reddit-Style Forum Engine)                */}
        {/* ----------------------------------------------------------------- */}
        {activeWindow === 'communities' && (
          <View style={styles.windowWrapper}>
            <View style={styles.communityTopNav}>
              <Text style={styles.communityHeaderTitle}>Communities</Text>
              <View style={styles.sorterRow}>
                {['hot', 'new', 'top'].map(sortType => (
                  <TouchableOpacity
                    key={sortType}
                    style={[styles.sortPill, communitySort === sortType && styles.sortPillActive]}
                    onPress={() => setCommunitySort(sortType)}
                  >
                    <Text style={[styles.sortPillText, communitySort === sortType && styles.sortPillTextActive]}>
                      {sortType.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <FlatList
              data={threads}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
              renderItem={({ item }) => (
                <View style={styles.forumCard}>
                  <View style={styles.forumHeader}>
                    <Text style={styles.forumSubName}>{item.community}</Text>
                    <View style={styles.flairBadge}>
                      <Text style={styles.flairText}>{item.flair}</Text>
                    </View>
                  </View>

                  <Text style={styles.forumTitle}>{item.title}</Text>

                  <View style={styles.forumActionRow}>
                    <View style={styles.votingPill}>
                      <TouchableOpacity><Text style={styles.voteArrow}>▲</Text></TouchableOpacity>
                      <Text style={styles.voteScore}>{item.upvotes}</Text>
                      <TouchableOpacity><Text style={styles.voteArrow}>▼</Text></TouchableOpacity>
                    </View>

                    <Text style={styles.forumCommentCount}>💬 {item.comments} Replies</Text>

                    {item.isResolvedSolution && (
                      <View style={styles.solutionPill}>
                        <Text style={styles.solutionPillText}>✓ 1 Credit Verified</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 4: DIRECT (Instagram-Grade Messaging Suite)                */}
        {/* ----------------------------------------------------------------- */}
        {activeWindow === 'direct' && (
          <View style={[styles.windowWrapper, vanishMode && styles.vanishModeWrapper]}>
            {/* Direct Header */}
            <View style={styles.directHeader}>
              <View>
                <Text style={styles.directHeaderTitle}>Direct Messaging</Text>
                <Text style={styles.vanishStatusText}>
                  {vanishMode ? '🔒 Vanish Mode Active (Auto-Deletes)' : 'Standard Encrypted Chat'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.vanishToggleBtn, vanishMode && styles.vanishToggleActive]}
                onPress={() => setVanishMode(!vanishMode)}
              >
                <Text style={styles.vanishToggleText}>{vanishMode ? 'Exit Vanish' : 'Vanish Mode'}</Text>
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <FlatList
              data={chatMessages}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 14, paddingBottom: 20 }}
              renderItem={({ item }) => (
                <View style={[styles.bubbleWrapper, item.isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                  <Text style={styles.bubbleSender}>{item.sender}</Text>
                  <View style={[styles.bubbleBox, item.isMe ? styles.bubbleMe : styles.bubbleOther]}>
                    <Text style={styles.bubbleText}>{item.text}</Text>
                  </View>
                  <Text style={styles.bubbleTime}>{item.time}</Text>
                </View>
              )}
            />

            {/* Message Bar */}
            <View style={styles.chatInputBar}>
              <TextInput
                style={styles.chatTextInput}
                placeholder={vanishMode ? "Disappearing message..." : "Message or forward contribution..."}
                placeholderTextColor="#64748b"
                value={messageInput}
                onChangeText={setMessageInput}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendMessage}>
                <Text style={styles.chatSendText}>➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* WINDOW 5: PROFILE & VAULT (Credentials, Karma & Credits)         */}
        {/* ----------------------------------------------------------------- */}
        {activeWindow === 'profile' && (
          <ScrollView style={styles.windowWrapper} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Profile Info */}
            <View style={styles.profileHeaderBox}>
              <View style={styles.avatarBig}>
                <Text style={styles.avatarBigText}>N</Text>
              </View>
              <Text style={styles.profileName}>Nihanshu</Text>
              <Text style={styles.profileHandle}>@nihanshu_builder</Text>

              {/* National Development Credit Card */}
              <View style={styles.creditCardBox}>
                <View style={styles.creditCardTop}>
                  <Text style={styles.creditCardLabel}>NATIONAL DEVELOPMENT CREDIT BALANCE</Text>
                  <Text style={styles.creditTier}>TIER 2 CONTRIBUTOR</Text>
                </View>
                <Text style={styles.creditScoreDisplay}>{userCredits} PTS</Text>
                <Text style={styles.creditCardDesc}>
                  Earned via verified peer solutions in Education, Open Research, and Municipal Hazard Audits.
                </Text>
              </View>

              {/* Counters */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>38</Text>
                  <Text style={styles.statLabel}>Dispatches</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>1.4k</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>480</Text>
                  <Text style={styles.statLabel}>Karma</Text>
                </View>
              </View>
            </View>

            {/* Content Portfolio Grid */}
            <View style={styles.portfolioGrid}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} style={styles.portfolioSquare}>
                  <Text style={styles.portfolioSquareText}>Evidence #{item}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

      </View>

      {/* ----------------------------------------------------------------- */}
      {/* 5-WINDOW BOTTOM NAVIGATION DOCK                                   */}
      {/* ----------------------------------------------------------------- */}
      <View style={styles.bottomDock}>
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => setActiveWindow('feed')}
        >
          <Text style={[styles.dockIcon, activeWindow === 'feed' && styles.dockActive]}>📰</Text>
          <Text style={[styles.dockLabel, activeWindow === 'feed' && styles.dockActive]}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => setActiveWindow('clips')}
        >
          <Text style={[styles.dockIcon, activeWindow === 'clips' && styles.dockActive]}>🎬</Text>
          <Text style={[styles.dockLabel, activeWindow === 'clips' && styles.dockActive]}>Clips</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => setActiveWindow('communities')}
        >
          <Text style={[styles.dockIcon, activeWindow === 'communities' && styles.dockActive]}>🌐</Text>
          <Text style={[styles.dockLabel, activeWindow === 'communities' && styles.dockActive]}>Boards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => setActiveWindow('direct')}
        >
          <Text style={[styles.dockIcon, activeWindow === 'direct' && styles.dockActive]}>💬</Text>
          <Text style={[styles.dockLabel, activeWindow === 'direct' && styles.dockActive]}>Direct</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => setActiveWindow('profile')}
        >
          <Text style={[styles.dockIcon, activeWindow === 'profile' && styles.dockActive]}>👤</Text>
          <Text style={[styles.dockLabel, activeWindow === 'profile' && styles.dockActive]}>Vault</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f19' },
  mainStage: { flex: 1 },
  windowWrapper: { flex: 1, backgroundColor: '#0b0f19' },

  /* Top Feed Navigation */
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  logoTitle: { fontSize: 20, fontWeight: '900', color: '#38bdf8', letterSpacing: 1.5 },
  feedModeToggle: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 20, padding: 3 },
  modeBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16 },
  modeBtnActive: { backgroundColor: '#38bdf8' },
  modeBtnText: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  modeBtnTextActive: { color: '#000000' },

  /* Stories */
  storiesContainer: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  storyBubbleWrapper: { alignItems: 'center', marginHorizontal: 8, width: 62 },
  storyRing: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#38bdf8', justifyContent: 'center', alignItems: 'center' },
  myStoryRing: { borderColor: '#64748b' },
  storyAvatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  storyInitial: { color: '#ffffff', fontWeight: 'bold' },
  storyName: { color: '#94a3b8', fontSize: 10, marginTop: 4 },

  /* Feed Cards */
  feedCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  feedHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  authorName: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  authorHandle: { color: '#64748b', fontSize: 11, marginTop: 2 },
  creditTag: { backgroundColor: '#064e3b', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  creditTagText: { color: '#34d399', fontSize: 9, fontWeight: '800' },
  feedText: { color: '#e2e8f0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  mockMediaContainer: { height: 180, backgroundColor: '#1e293b', borderRadius: 8, marginVertical: 10, justifyContent: 'center', alignItems: 'center' },
  mockMediaText: { color: '#64748b', fontSize: 12 },
  cardActionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 16 },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  actionText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  creditActionBtn: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#f59e0b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  creditActionText: { color: '#f59e0b', fontSize: 11, fontWeight: '800' },

  /* Clips View */
  clipsContainer: { flex: 1, backgroundColor: '#000' },
  clipsVideoScreen: { flex: 1, justifyContent: 'flex-end', padding: 20, paddingBottom: 90 },
  clipWatermark: { position: 'absolute', top: 30, left: 20, color: '#38bdf8', fontWeight: '900', letterSpacing: 2 },
  clipDescriptionTitle: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  clipDescriptionSub: { color: '#cbd5e1', fontSize: 12, marginTop: 4, maxWidth: '80%' },
  clipSideRail: { position: 'absolute', right: 16, bottom: 100, alignItems: 'center', gap: 16 },
  clipIconBtn: { alignItems: 'center' },
  clipIconText: { fontSize: 26, color: '#fff' },
  clipMetricText: { color: '#fff', fontSize: 10, marginTop: 2 },
  clipCreditBtn: { backgroundColor: '#f59e0b', borderRadius: 24, padding: 8, width: 48, height: 48, justifyContent: 'center' },
  clipCreditMetric: { color: '#000', fontSize: 8, fontWeight: '900', marginTop: 2 },

  /* Communities Forum */
  communityTopNav: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  communityHeaderTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800' },
  sorterRow: { flexDirection: 'row', gap: 6 },
  sortPill: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, backgroundColor: '#1e293b' },
  sortPillActive: { backgroundColor: '#38bdf8' },
  sortPillText: { color: '#64748b', fontSize: 10, fontWeight: '700' },
  sortPillTextActive: { color: '#000' },
  forumCard: { backgroundColor: '#111827', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#1f2937' },
  forumHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  forumSubName: { color: '#38bdf8', fontSize: 12, fontWeight: '700' },
  flairBadge: { backgroundColor: '#1e293b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  flairText: { color: '#e2e8f0', fontSize: 9, fontWeight: '700' },
  forumTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '700', lineHeight: 21 },
  forumActionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 14 },
  votingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, gap: 6 },
  voteArrow: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  voteScore: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  forumCommentCount: { color: '#64748b', fontSize: 11 },
  solutionPill: { backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  solutionPillText: { color: '#34d399', fontSize: 10, fontWeight: '700' },

  /* Direct Messaging */
  directHeader: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  directHeaderTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  vanishStatusText: { color: '#64748b', fontSize: 10 },
  vanishToggleBtn: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  vanishToggleActive: { backgroundColor: '#7c3aed' },
  vanishToggleText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  vanishModeWrapper: { backgroundColor: '#050505' },
  bubbleWrapper: { marginBottom: 10, maxWidth: '80%' },
  bubbleLeft: { alignSelf: 'flex-start' },
  bubbleRight: { alignSelf: 'flex-end' },
  bubbleSender: { color: '#64748b', fontSize: 10, marginBottom: 2 },
  bubbleBox: { padding: 12, borderRadius: 14 },
  bubbleMe: { backgroundColor: '#0284c7' },
  bubbleOther: { backgroundColor: '#1e293b' },
  bubbleText: { color: '#ffffff', fontSize: 13, lineHeight: 18 },
  bubbleTime: { color: '#64748b', fontSize: 9, marginTop: 2, alignSelf: 'flex-end' },
  chatInputBar: { flexDirection: 'row', padding: 10, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b' },
  chatTextInput: { flex: 1, backgroundColor: '#1e293b', borderRadius: 20, paddingHorizontal: 14, color: '#fff', fontSize: 13 },
  chatSendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#38bdf8', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  chatSendText: { color: '#000', fontWeight: 'bold' },

  /* Profile & Vault */
  profileHeaderBox: { alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  avatarBig: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#38bdf8', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarBigText: { fontSize: 32, fontWeight: '900', color: '#000' },
  profileName: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  profileHandle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  creditCardBox: { backgroundColor: '#111827', borderWidth: 1, borderColor: '#f59e0b', borderRadius: 12, padding: 14, width: '100%', marginTop: 16 },
  creditCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditCardLabel: { fontSize: 9, fontWeight: '900', color: '#f59e0b' },
  creditTier: { fontSize: 9, fontWeight: '800', color: '#34d399' },
  creditScoreDisplay: { fontSize: 26, fontWeight: '900', color: '#ffffff', marginVertical: 6 },
  creditCardDesc: { fontSize: 11, color: '#94a3b8', lineHeight: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 18 },
  statBox: { alignItems: 'center' },
  statNumber: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  statLabel: { color: '#64748b', fontSize: 11, marginTop: 2 },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 2 },
  portfolioSquare: { width: width / 3 - 4, height: width / 3 - 4, backgroundColor: '#1e293b', margin: 2, justifyContent: 'center', alignItems: 'center' },
  portfolioSquareText: { color: '#64748b', fontSize: 11, fontWeight: '600' },

  /* Bottom Dock */
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#0a0d14',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  dockItem: { alignItems: 'center', justifyContent: 'center' },
  dockIcon: { fontSize: 18, color: '#64748b' },
  dockLabel: { fontSize: 10, color: '#64748b', marginTop: 2, fontWeight: '600' },
  dockActive: { color: '#38bdf8' }
});
