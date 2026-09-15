import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import Purchases from 'react-native-purchases';
import { BusinessProfile, BusinessModel, BusinessCategory, MemeTemplate, ScheduledPost } from './src/types';
import { defaultProfile, generateMobileMemeDeck } from './src/hookEngine';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function FeedVideo({ uri, isMuted = false }: { uri: string; isMuted?: boolean }) {
  const isImage = /\.(jpg|jpeg|png|webp)/i.test(uri);
  const player = useVideoPlayer(isImage ? null : uri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = isMuted;
    videoPlayer.volume = 1.0;
    videoPlayer.audioMixingMode = 'doNotMix';
    videoPlayer.play();
  });

  useEffect(() => {
    if (player) {
      player.muted = isMuted;
      player.volume = 1.0;
      if (!isMuted) {
        player.play();
      }
    }
  }, [player, isMuted]);

  if (isImage) return <Image source={{ uri }} style={styles.videoPlayer} resizeMode="cover" />;
  return (
    <VideoView
      player={player}
      style={styles.videoPlayer}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

const PRESETS: { label: string; profile: Partial<BusinessProfile> }[] = [
  {
    label: '🚀 B2B SaaS',
    profile: {
      name: 'Alex',
      companyName: 'SyncFlow AI',
      productService: 'Autonomous AI workflow platform that automates customer support and CRM updates',
      audience: 'SaaS founders, customer support leads, and growth teams',
      problemSolved: 'Spending 6 hours a day replying to repetitive support tickets and losing customers',
      keyBenefits: '90% ticket deflection rate, instant 24/7 replies, and 10x lower support costs',
      tonePositioning: 'Witty, hyper-relatable, authoritative yet playful startup humor',
      thingsToAvoid: 'Boring corporate speak, stiff corporate headshots, complex technical jargon',
      businessModel: 'B2B',
      categories: ['SaaS', 'Mobile app'],
    },
  },
  {
    label: '📸 Photo App',
    profile: {
      name: 'Elena',
      companyName: 'Lumina Photo',
      productService: '1-tap AI smartphone photo enhancer that erases tourists and cleans blurry backgrounds',
      audience: 'Content creators, travel influencers, and everyday smartphone photographers',
      problemSolved: 'Photobombers, tourists, and power lines ruining once-in-a-lifetime vacation memories',
      keyBenefits: 'Erases distractions in 1 tap with zero blurry artifacts or Photoshop complexity',
      tonePositioning: 'Aesthetic, inspiring, playful, lifestyle luxury',
      thingsToAvoid: 'Overly technical AI terms, fake plastic airbrushing',
      businessModel: 'B2C',
      categories: ['Mobile app', 'Media/Content'],
    },
  },
  {
    label: '💼 Fintech',
    profile: {
      name: 'Marcus',
      companyName: 'Kanso Finance',
      productService: 'Minimalist automated bookkeeping that tracks tax write-offs directly from bank accounts',
      audience: 'Freelancers, remote agency owners, and independent contractors',
      problemSolved: 'Drowning in crumpled receipts and tax season panic every April',
      keyBenefits: 'Recovers an average of $4,200 in forgotten deductions with zero manual spreadsheets',
      tonePositioning: 'Relatable financial relief, dry sarcasm about taxes, zen simplicity',
      thingsToAvoid: 'CPA jargon, boring ledger tables, IRS fearmongering',
      businessModel: 'B2B',
      categories: ['SaaS', 'Services'],
    },
  },
  {
    label: '🍵 E-Commerce',
    profile: {
      name: 'Sophia',
      companyName: 'Aura Wellness',
      productService: 'Ceremonial grade Japanese matcha powder infused with organic lion’s mane mushrooms',
      audience: 'Productivity enthusiasts, designers, students, and caffeine-sensitive professionals',
      problemSolved: 'The violent 2 PM coffee crash, jittery heart palpitations, and morning anxiety',
      keyBenefits: 'Delivers 6 hours of calm, jitter-free focus with sustained clean energy',
      tonePositioning: 'Mindful aesthetic, calm focus, premium health & wellness',
      thingsToAvoid: 'Gym-bro energy drink vibes, unrealistic medical claims',
      businessModel: 'B2C',
      categories: ['E-commerce'],
    },
  },
];

const COOKING_STEPS = [
  'Analyzing brand tone & target audience...',
  'Searching 66 viral video meme blueprints...',
  'Synthesizing high-retention kinetic hooks...',
  'Optimizing for Instagram & TikTok algorithms...',
];

export default function App() {
  // Onboarding Steps: 1: Brand, 2: Offer, 3: Positioning, 4: Category, 5: Cooking
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [cookingStepIndex, setCookingStepIndex] = useState(0);

  // Business Questionnaire State
  const [business, setBusiness] = useState<BusinessProfile>(defaultProfile);
  const [selectedModel, setSelectedModel] = useState<BusinessModel>('B2B');
  const [selectedCategories, setSelectedCategories] = useState<BusinessCategory[]>(['SaaS']);
  const [errorMsg, setErrorMsg] = useState('');

  // Deck & Feed State
  const [deck, setDeck] = useState<MemeTemplate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Pro & RevenueCat
  const [isPro, setIsPro] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeMeme, setActiveMeme] = useState<MemeTemplate | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Swipe Animation State
  const pan = useRef(new Animated.ValueXY()).current;

  // Auth & Shared Instagram State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authUsername, setAuthUsername] = useState('demo_creator');
  const [authPassword, setAuthPassword] = useState('shipaton2026');
  const [authShowPassword, setAuthShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [logoutNotice, setLogoutNotice] = useState('');

  const handleLogin = () => {
    if (!authUsername.trim()) {
      setAuthError('Please enter a username');
      return;
    }
    if (!authPassword.trim()) {
      setAuthError('Please enter a password');
      return;
    }
    setAuthError('');
    setLogoutNotice('');
    setCurrentUser(authUsername.trim());
  };

  const handleQuickDemoLogin = () => {
    setAuthUsername('demo_creator');
    setAuthPassword('shipaton2026');
    setAuthError('');
    setLogoutNotice('');
    setCurrentUser('demo_creator');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of business-marketing-engine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            const prev = currentUser;
            setCurrentUser(null);
            setLogoutNotice(`Logged out from @${prev || 'demo_creator'}`);
          },
        },
      ]
    );
  };

  // Initialize RevenueCat SDK
  useEffect(() => {
    async function initRevenueCat() {
      try {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        // In Expo Go, RevenueCat Test Store requires a key starting with 'test_'
        const apiKey = Platform.select({
          ios: 'test_shipaton26_bme_ios',
          android: 'test_shipaton26_bme_android',
          default: 'test_shipaton26_bme',
        });
        await Purchases.configure({ apiKey });
        const customerInfo = await Purchases.getCustomerInfo();
        if (customerInfo?.entitlements?.active?.['pro_access']) {
          setIsPro(true);
        }
      } catch (e) {
        console.log('RevenueCat demo mode active (Expo Go Test Store fallback):', (e as Error)?.message || e);
      }
    }
    initRevenueCat();
  }, []);

  // Cooking progress timer
  useEffect(() => {
    if (onboardingStep === 5) {
      const interval = setInterval(() => {
        setCookingStepIndex((prev) => (prev + 1) % COOKING_STEPS.length);
      }, 550);
      return () => clearInterval(interval);
    }
  }, [onboardingStep]);

  // PanResponder for Tinder Card Swiping
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          // Swipe Right (Approve)
          Animated.timing(pan, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            handleApprove();
          });
        } else if (gesture.dx < -120) {
          // Swipe Left (Reject)
          Animated.timing(pan, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            handleReject();
          });
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const applyPreset = (preset: Partial<BusinessProfile>) => {
    setBusiness((prev) => ({
      ...prev,
      ...preset,
    }));
    if (preset.businessModel) setSelectedModel(preset.businessModel);
    if (preset.categories) setSelectedCategories(preset.categories);
    setErrorMsg('');
  };

  const handleReject = () => {
    setCurrentIndex((prev) => prev + 1);
    setShowRationale(false);
  };

  const handleApprove = () => {
    if (deck[currentIndex]) {
      setActiveMeme(deck[currentIndex]);
      setIsScheduleModalOpen(true);
    }
  };

  const confirmSchedule = () => {
    if (activeMeme) {
      const newPost: ScheduledPost = {
        id: `sched_${Date.now()}`,
        templateId: activeMeme.id,
        videoUrl: activeMeme.video_url,
        hook: activeMeme.hook,
        caption: activeMeme.caption,
        hashtags: activeMeme.hashtags,
        scheduledDate: 'Today',
        scheduledTime: '6:30 PM (Peak)',
        status: postToInstagram ? 'published' : 'scheduled',
        viewsForecast: '145k',
      };
      setScheduledPosts((prev) => [newPost, ...prev]);
      setIsScheduleModalOpen(false);
      setCurrentIndex((prev) => prev + 1);
      setShowRationale(false);
      Alert.alert(
        'Published to Instagram Reels! 🚀',
        `Reel with hook "${activeMeme.hook}" published to shared demo account @business_marketing_engine via sandbox endpoint.`
      );
    }
  };

  const handleStartCooking = () => {
    setOnboardingStep(5);
    setTimeout(() => {
      const full: BusinessProfile = {
        ...business,
        businessModel: selectedModel,
        categories: selectedCategories,
        onboarded: true,
      };
      setBusiness(full);
      const generatedDeck = generateMobileMemeDeck(full);
      setDeck(generatedDeck);
      setIsOnboarded(true);
    }, 2400);
  };

  const currentCard = deck[currentIndex];

  // ============================================================
  // SCREEN: AUTH / LOGIN SCREEN
  // ============================================================
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
          {logoutNotice ? (
            <View style={styles.authLogoutBanner}>
              <Text style={styles.authLogoutText}>✓ {logoutNotice}</Text>
            </View>
          ) : null}

          <View style={styles.authHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✨ Shipaton 2026 Demo Access</Text>
            </View>
            <Text style={styles.headerTitle}>business-marketing-engine</Text>
            <Text style={styles.headerSubtitle}>
              Autonomous viral video deck, calendar scheduling, and RevenueCat paywall.
            </Text>
          </View>

          {/* Shared Instagram Demo API Banner */}
          <View style={styles.sharedIgCard}>
            <Text style={styles.sharedIgTitle}>📸 Shared Instagram Demo API</Text>
            <Text style={styles.sharedIgSub}>
              For demo convenience, all accounts automatically post to the shared Instagram handle{' '}
              <Text style={{ color: '#FFF', fontWeight: '800' }}>@business_marketing_engine</Text> via our live sandbox endpoint.
            </Text>
          </View>

          {/* Quick 1-Tap Demo Credentials Card */}
          <View style={styles.demoCredsCard}>
            <View style={styles.demoCredsRow}>
              <Text style={styles.demoCredsLabel}>DEMO CREDENTIALS (SAVED)</Text>
              <Text style={styles.demoCredsReady}>READY</Text>
            </View>
            <View style={styles.demoCredsBox}>
              <Text style={styles.demoCredsText}>Username: <Text style={{ color: '#FFF', fontWeight: '700' }}>demo_creator</Text></Text>
              <Text style={styles.demoCredsText}>Password: <Text style={{ color: '#FFF', fontWeight: '700' }}>shipaton2026</Text></Text>
            </View>
            <TouchableOpacity style={styles.quickLoginButton} onPress={handleQuickDemoLogin}>
              <Text style={styles.quickLoginText}>⚡ Instant 1-Tap Demo Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Manual Login Form */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.textInput}
              value={authUsername}
              onChangeText={(t) => { setAuthUsername(t); setAuthError(''); }}
              placeholder="e.g. demo_creator"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                value={authPassword}
                onChangeText={(t) => { setAuthPassword(t); setAuthError(''); }}
                placeholder="Enter password"
                placeholderTextColor="#666"
                secureTextEntry={!authShowPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.showPasswordBtn}
                onPress={() => setAuthShowPassword(!authShowPassword)}
              >
                <Text style={styles.showPasswordText}>{authShowPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

            <TouchableOpacity style={[styles.primaryButton, { marginTop: 12 }]} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Sign In to Engine →</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.authFootnote}>
            RevenueCat Shipaton 2026 • Business × Productivity
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // SCREEN: ONBOARDING FLOW (LOOSE, AIRY, BREATHING)
  // ============================================================
  if (!isOnboarded) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Top Progress Bar for Steps 1-4 */}
        {onboardingStep <= 4 && (
          <View style={styles.topProgressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.stepIndicatorText}>STEP {onboardingStep} OF 4</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logoutLink}>Exit (@{currentUser})</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBarFill, { width: `${(onboardingStep / 4) * 100}%` }]} />
            </View>
          </View>
        )}

        {/* STEP 1: Brand Identity */}
        {onboardingStep === 1 && (
          <ScrollView contentContainerStyle={styles.onboardScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✨ Active User: @{currentUser}</Text>
            </View>
            <Text style={styles.headerTitle}>business-marketing-engine</Text>
            <Text style={styles.headerSubtitle}>
              Autonomous viral marketing & video scheduling engine for your business.
            </Text>

            {/* Quick Demo Presets */}
            <View style={styles.presetSection}>
              <Text style={styles.presetHeading}>QUICK EXAMPLE PRESETS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
                {PRESETS.map((p, i) => (
                  <TouchableOpacity key={i} style={styles.presetChip} onPress={() => applyPreset(p.profile)}>
                    <Text style={styles.presetChipText}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Loose, Airy Input Card */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Company / Brand Name</Text>
              <TextInput
                style={styles.textInput}
                value={business.companyName}
                onChangeText={(t) => setBusiness({ ...business, companyName: t })}
                placeholder="e.g. SyncFlow AI"
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Your Name</Text>
              <TextInput
                style={styles.textInput}
                value={business.name}
                onChangeText={(t) => setBusiness({ ...business, name: t })}
                placeholder="e.g. Alex"
                placeholderTextColor="#666"
              />
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                if (!business.companyName.trim()) {
                  setErrorMsg('Please enter a company name.');
                  return;
                }
                setErrorMsg('');
                setOnboardingStep(2);
              }}
            >
              <Text style={styles.primaryButtonText}>Continue →</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* STEP 2: The Offer & Target Audience */}
        {onboardingStep === 2 && (
          <ScrollView contentContainerStyle={styles.onboardScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setOnboardingStep(1)}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>What do you build?</Text>
            <Text style={styles.headerSubtitle}>
              Describe what your product does and who it is built for.
            </Text>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Product / Service Description</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaLarge]}
                multiline
                numberOfLines={3}
                value={business.productService}
                onChangeText={(t) => setBusiness({ ...business, productService: t })}
                placeholder="e.g. Autonomous AI support platform that resolves tickets instantly without human delay..."
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Target Audience</Text>
              <TextInput
                style={styles.textInput}
                value={business.audience}
                onChangeText={(t) => setBusiness({ ...business, audience: t })}
                placeholder="e.g. SaaS founders, customer support teams, indie hackers"
                placeholderTextColor="#666"
              />
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setOnboardingStep(1)}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1 }]}
                onPress={() => {
                  if (!business.productService.trim() || !business.audience.trim()) {
                    setErrorMsg('Please fill in both fields.');
                    return;
                  }
                  setErrorMsg('');
                  setOnboardingStep(3);
                }}
              >
                <Text style={styles.primaryButtonText}>Continue →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* STEP 3: Hook & Positioning */}
        {onboardingStep === 3 && (
          <ScrollView contentContainerStyle={styles.onboardScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setOnboardingStep(2)}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>The Hook & Positioning</Text>
            <Text style={styles.headerSubtitle}>
              Viral hooks tap directly into pain and transformation.
            </Text>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Problem Solved (Pain Point)</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaMedium]}
                multiline
                numberOfLines={2}
                value={business.problemSolved}
                onChangeText={(t) => setBusiness({ ...business, problemSolved: t })}
                placeholder="e.g. Spending 15 hours a week editing reels that get 200 views..."
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Key Benefit (Transformation)</Text>
              <TextInput
                style={styles.textInput}
                value={business.keyBenefits}
                onChangeText={(t) => setBusiness({ ...business, keyBenefits: t })}
                placeholder="e.g. Generates high-retention 9:16 viral hooks in seconds"
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Tone & Voice</Text>
              <TextInput
                style={styles.textInput}
                value={business.tonePositioning}
                onChangeText={(t) => setBusiness({ ...business, tonePositioning: t })}
                placeholder="e.g. Witty, hyper-relatable tech humor"
                placeholderTextColor="#666"
              />

              <Text style={styles.inputLabel}>Things to Avoid</Text>
              <TextInput
                style={styles.textInput}
                value={business.thingsToAvoid}
                onChangeText={(t) => setBusiness({ ...business, thingsToAvoid: t })}
                placeholder="e.g. Corporate speak, stiff headshots"
                placeholderTextColor="#666"
              />
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setOnboardingStep(2)}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 1 }]}
                onPress={() => {
                  if (!business.problemSolved.trim() || !business.keyBenefits.trim()) {
                    setErrorMsg('Please specify the problem and key benefit.');
                    return;
                  }
                  setErrorMsg('');
                  setOnboardingStep(4);
                }}
              >
                <Text style={styles.primaryButtonText}>Continue →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* STEP 4: Business Model & Category */}
        {onboardingStep === 4 && (
          <ScrollView contentContainerStyle={styles.onboardScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setOnboardingStep(3)}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>What type of business?</Text>
            <Text style={styles.headerSubtitle}>
              Helps us match viral blueprints with your specific niche.
            </Text>

            <Text style={styles.sectionHeading}>BUSINESS MODEL</Text>
            <View style={styles.modelRow}>
              {(['B2B', 'B2C', 'Both'] as BusinessModel[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modelCard, selectedModel === m && styles.modelCardSelected]}
                  onPress={() => setSelectedModel(m)}
                >
                  <Text style={[styles.modelText, selectedModel === m && styles.modelTextSelected]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionHeading}>CATEGORY (SELECT ALL THAT APPLY)</Text>
            <View style={styles.categoryGrid}>
              {(['E-commerce', 'SaaS', 'Agency', 'Services', 'Marketplace', 'Media/Content', 'Mobile app', 'Other'] as BusinessCategory[]).map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catCard, isSelected && styles.catCardSelected]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
                      } else {
                        setSelectedCategories([...selectedCategories, cat]);
                      }
                    }}
                  >
                    <Text style={[styles.catText, isSelected && styles.catTextSelected]}>
                      {cat} {isSelected ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setOnboardingStep(3)}>
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={handleStartCooking}>
                <Text style={styles.primaryButtonText}>Generate Content Deck 🚀</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* STEP 5: Animated Cooking Loader */}
        {onboardingStep === 5 && (
          <View style={styles.cookingContainer}>
            <View style={styles.cookingGlow} />
            <Text style={styles.cookingEmoji}>🧠</Text>
            <Text style={styles.cookingTitle}>Synthesizing Viral Deck...</Text>
            <Text style={styles.cookingSub}>
              {COOKING_STEPS[cookingStepIndex]}
            </Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <View style={styles.cookingChecklist}>
              {COOKING_STEPS.map((s, i) => (
                <View key={i} style={styles.checklistRow}>
                  <Text style={i <= cookingStepIndex ? styles.checkDone : styles.checkPending}>
                    {i <= cookingStepIndex ? '✓' : '○'}
                  </Text>
                  <Text style={[styles.checkText, i === cookingStepIndex && styles.checkTextActive]}>
                    {s}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ============================================================
  // SCREEN: TINDER SWIPEABLE FEED
  // ============================================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top App Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.brandTitle}>{business.companyName}</Text>
          <Text style={styles.brandSub}>{business.businessModel} • @{currentUser}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.proPill}
            onPress={() => setIsPaywallOpen(true)}
          >
            <Text style={styles.proPillText}>{isPro ? '⭐ PRO ACTIVE' : '👑 UPGRADE PRO'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exitPill}
            onPress={handleLogout}
          >
            <Text style={styles.exitPillText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Center 9:16 Card Stack */}
      <View style={styles.deckContainer}>
        {currentCard ? (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.card,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  {
                    rotate: pan.x.interpolate({
                      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                      outputRange: ['-18deg', '0deg', '18deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* 9:16 Video Player */}
            <FeedVideo uri={currentCard.video_url} isMuted={isMuted} />

            {/* Gradient Dimmer for Top Hook Legibility */}
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.4)']}
              style={styles.cardGradient}
            />

            {/* Top Badges */}
            <View style={styles.cardTopBar}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.cardBadge}>🎬 Video Meme</Text>
                <TouchableOpacity
                  style={[styles.soundBadge, !isMuted && styles.soundBadgeActive]}
                  onPress={() => setIsMuted(!isMuted)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.soundBadgeText}>{isMuted ? '🔇' : '🔊'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.whyBadge}
                onPress={() => setShowRationale(!showRationale)}
              >
                <Text style={styles.whyBadgeText}>💡 Why This?</Text>
              </TouchableOpacity>
            </View>

            {/* Expandable Why This Content? */}
            {showRationale && (
              <View style={styles.rationaleBox}>
                <Text style={styles.rationaleTitle}>Algorithmic Rationale</Text>
                <Text style={styles.rationaleText}>{currentCard.whyRationale}</Text>
              </View>
            )}

            {/* TikTok / Reels Floating Hook on TOP of Video */}
            <View style={styles.floatingTopHookContainer} pointerEvents="none">
              <Text style={styles.floatingTopHookText}>
                {currentCard.hook}
              </Text>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>All caught up! 🎉</Text>
            <Text style={styles.emptySub}>You reviewed all viral concepts for {business.companyName}.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentIndex(0)}>
              <Text style={styles.primaryButtonText}>Review Deck Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Floating Action Dock */}
      <View style={styles.actionDock}>
        <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
          <Text style={styles.actionBtnText}>❌</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setShowRationale(!showRationale)}
        >
          <Text style={styles.actionBtnText}>💡</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
          <Text style={styles.actionBtnText}>✅</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule Modal */}
      <Modal visible={isScheduleModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Schedule Instagram Reel</Text>
            <Text style={styles.modalSub}>Approved Hook: &ldquo;{activeMeme?.hook}&rdquo;</Text>

            <TouchableOpacity
              style={[styles.checkboxRow, postToInstagram && styles.checkboxRowActive]}
              onPress={() => setPostToInstagram(!postToInstagram)}
            >
              <Text style={styles.checkboxLabel}>📸 Instagram Reels (@business_marketing_engine - Shared Demo)</Text>
              <Text style={styles.checkboxCheck}>{postToInstagram ? '✓' : ''}</Text>
            </TouchableOpacity>

            <View style={styles.timePickerCard}>
              <Text style={styles.timeLabel}>Peak Posting Slot: Today at 6:30 PM (🔥 Peak Audience)</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsScheduleModalOpen(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmSchedule}>
                <Text style={styles.confirmBtnText}>Schedule Post 🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* RevenueCat Paywall Modal */}
      <Modal visible={isPaywallOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.paywallCrown}>👑</Text>
            <Text style={styles.modalTitle}>business-marketing-engine Pro</Text>
            <Text style={styles.modalSub}>Unlock unlimited auto-scheduling, 1080p HD clean exports, and AI Green Screen compositing.</Text>

            <View style={styles.paywallPlans}>
              <TouchableOpacity
                style={styles.planCardSelected}
                onPress={() => {
                  setIsPro(true);
                  setIsPaywallOpen(false);
                  Alert.alert('Subscribed! 🎉', 'Welcome to business-marketing-engine Pro powered by RevenueCat.');
                }}
              >
                <Text style={styles.planName}>Annual (Best Value) - Save 38%</Text>
                <Text style={styles.planPrice}>$149.99 / year</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.planCard}
                onPress={() => {
                  setIsPro(true);
                  setIsPaywallOpen(false);
                  Alert.alert('Subscribed! 🎉', 'Welcome to business-marketing-engine Pro powered by RevenueCat.');
                }}
              >
                <Text style={styles.planName}>Monthly</Text>
                <Text style={styles.planPrice}>$19.99 / month</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsPaywallOpen(false)}>
              <Text style={styles.cancelBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  topProgressContainer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 10 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stepIndicatorText: { color: '#10B981', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  stepNameText: { color: '#737373', fontSize: 11, fontWeight: '600' },
  progressTrack: { height: 4, backgroundColor: '#1F1F1F', borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10B981' },
  onboardScroll: { paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 40 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 12,
  },
  badgeText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFF', letterSpacing: -0.5, marginBottom: 6 },
  headerSubtitle: { fontSize: 13, color: '#A3A3A3', lineHeight: 19, marginBottom: 20 },
  presetSection: { marginBottom: 20 },
  presetHeading: { fontSize: 10, fontWeight: '800', color: '#737373', letterSpacing: 1, marginBottom: 8 },
  presetScroll: { gap: 8 },
  presetChip: {
    backgroundColor: '#171717',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  presetChipText: { color: '#D4D4D4', fontSize: 12, fontWeight: '600' },
  inputCard: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 6,
  },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#E5E5E5', marginTop: 10, marginBottom: 4 },
  textInput: {
    backgroundColor: '#1C1C1C',
    color: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  textAreaMedium: { height: 68, textAlignVertical: 'top' },
  textAreaLarge: { height: 90, textAlignVertical: 'top' },
  errorText: { color: '#F87171', fontSize: 12, marginBottom: 14, fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  buttonRow: { flexDirection: 'row', gap: 12 },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2D2D2D',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#A3A3A3', fontSize: 13, fontWeight: '700' },
  backButton: { color: '#A3A3A3', fontSize: 13, fontWeight: '600', marginBottom: 14 },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: '#737373', marginTop: 16, marginBottom: 10, letterSpacing: 1 },
  modelRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  modelCard: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#141414',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#262626',
    alignItems: 'center',
  },
  modelCardSelected: { borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)' },
  modelText: { color: '#A3A3A3', fontWeight: '800', fontSize: 14 },
  modelTextSelected: { color: '#FFF' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  catCard: {
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#141414',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  catCardSelected: { borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.15)' },
  catText: { color: '#D4D4D4', fontSize: 12, fontWeight: '600' },
  catTextSelected: { color: '#FFF', fontWeight: '800' },
  cookingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  cookingGlow: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: '#10B981', opacity: 0.15 },
  cookingEmoji: { fontSize: 54, marginBottom: 16 },
  cookingTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  cookingSub: { fontSize: 13, color: '#A3A3A3', textAlign: 'center', marginTop: 8, marginBottom: 24, maxWidth: 300, minHeight: 40 },
  progressBar: { width: '85%', height: 6, backgroundColor: '#262626', borderRadius: 3, overflow: 'hidden', marginBottom: 24 },
  progressFill: { width: '100%', height: '100%', backgroundColor: '#10B981' },
  cookingChecklist: { width: '85%', gap: 10 },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkDone: { color: '#10B981', fontSize: 13, fontWeight: '900' },
  checkPending: { color: '#525252', fontSize: 13 },
  checkText: { color: '#737373', fontSize: 12 },
  checkTextActive: { color: '#FFF', fontWeight: '700' },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  brandTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  brandSub: { color: '#A3A3A3', fontSize: 11 },
  proPill: { backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  proPillText: { color: '#000', fontSize: 10, fontWeight: '900' },
  deckContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  card: { width: SCREEN_WIDTH - 30, height: SCREEN_HEIGHT * 0.65, borderRadius: 28, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: '#262626' },
  videoPlayer: { ...StyleSheet.absoluteFill },
  cardGradient: { ...StyleSheet.absoluteFill },
  cardTopBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  cardBadge: { backgroundColor: 'rgba(0,0,0,0.65)', color: '#FFF', fontSize: 11, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  soundBadge: { backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  soundBadgeActive: { backgroundColor: 'rgba(16, 185, 129, 0.25)', borderColor: '#10B981' },
  soundBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  whyBadge: { backgroundColor: 'rgba(16, 185, 129, 0.85)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  whyBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  rationaleBox: { marginHorizontal: 16, padding: 14, backgroundColor: 'rgba(20,20,20,0.96)', borderRadius: 16, borderWidth: 1, borderColor: '#10B981' },
  rationaleTitle: { color: '#34D399', fontSize: 11, fontWeight: '800', marginBottom: 4 },
  rationaleText: { color: '#E5E5E5', fontSize: 12, lineHeight: 18 },
  floatingTopHookContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
  },
  floatingTopHookText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.95)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  actionDock: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingVertical: 18 },
  rejectBtn: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#171717', borderWidth: 2, borderColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  editBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#171717', borderWidth: 1, borderColor: '#525252', alignItems: 'center', justifyContent: 'center' },
  approveBtn: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 24 },
  emptyContainer: { alignItems: 'center', padding: 24 },
  emptyTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', marginBottom: 8 },
  emptySub: { color: '#A3A3A3', fontSize: 13, textAlign: 'center', marginBottom: 24 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: '#161616', borderRadius: 24, padding: 22, borderWidth: 1, borderColor: '#2D2D2D' },
  modalTitle: { color: '#FFF', fontSize: 19, fontWeight: '900', textAlign: 'center' },
  modalSub: { color: '#A3A3A3', fontSize: 12, textAlign: 'center', marginTop: 6, marginBottom: 18 },
  checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14, backgroundColor: '#222222', borderRadius: 14, marginBottom: 16 },
  checkboxRowActive: { borderColor: '#10B981', borderWidth: 1 },
  checkboxLabel: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  checkboxCheck: { color: '#10B981', fontSize: 15, fontWeight: '900' },
  timePickerCard: { backgroundColor: '#222222', padding: 14, borderRadius: 14, marginBottom: 18 },
  timeLabel: { color: '#34D399', fontSize: 12, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#262626', alignItems: 'center' },
  cancelBtnText: { color: '#A3A3A3', fontWeight: '700', fontSize: 13 },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#10B981', alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  paywallCrown: { fontSize: 44, textAlign: 'center', marginBottom: 12 },
  paywallPlans: { gap: 12, marginVertical: 18 },
  planCard: { padding: 16, backgroundColor: '#222222', borderRadius: 16, borderWidth: 1, borderColor: '#333333' },
  planCardSelected: { padding: 16, backgroundColor: 'rgba(245, 158, 11, 0.15)', borderRadius: 16, borderWidth: 1.5, borderColor: '#F59E0B' },
  planName: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  planPrice: { color: '#F59E0B', fontWeight: '900', fontSize: 16, marginTop: 4 },
  authScroll: { paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 48 },
  authHeader: { marginTop: 12, marginBottom: 18 },
  authLogoutBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  authLogoutText: { color: '#34D399', fontSize: 12, fontWeight: '700' },
  sharedIgCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#17121E',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.25)',
    marginBottom: 16,
    gap: 6,
  },
  sharedIgTitle: { color: '#F472B6', fontSize: 13, fontWeight: '800' },
  sharedIgSub: { color: '#D4D4D4', fontSize: 12, lineHeight: 17 },
  demoCredsCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 16,
    gap: 10,
  },
  demoCredsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  demoCredsLabel: { fontSize: 10, fontWeight: '800', color: '#737373', letterSpacing: 1 },
  demoCredsReady: { fontSize: 10, fontWeight: '900', color: '#10B981', letterSpacing: 0.5 },
  demoCredsBox: { backgroundColor: '#1C1C1C', borderRadius: 12, padding: 10, gap: 4 },
  demoCredsText: { fontSize: 12, color: '#A3A3A3', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  quickLoginButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickLoginText: { color: '#34D399', fontSize: 13, fontWeight: '800' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  showPasswordBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1C1C1C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  showPasswordText: { color: '#A3A3A3', fontSize: 12, fontWeight: '700' },
  authFootnote: { textAlign: 'center', color: '#525252', fontSize: 11, marginTop: 16 },
  logoutLink: { color: '#EF4444', fontSize: 11, fontWeight: '700' },
  exitPill: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  exitPillText: { color: '#EF4444', fontSize: 11, fontWeight: '700' },
});
