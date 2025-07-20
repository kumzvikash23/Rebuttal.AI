# 🎤 Debating App - AI-Powered Speech Evaluation

A comprehensive debating application with AI evaluation, fallacy detection, and text-to-speech features.

## 🚀 Features

- **AI Speech Evaluation**: Get detailed feedback on your debating skills
- **Fallacy Detection**: Identify logical fallacies in arguments
- **Speaker Scale Feedback**: 5-star ratings for Clarity, Logic, Style, Impact, and Overall
- **Text-to-Speech**: Listen to AI feedback using Sarvam AI's TTS
- **Speech-to-Text**: Speak your arguments using microphone input
- **Speech History**: Track your progress over time
- **Interactive Quizzes**: End-of-chapter quizzes with match-the-columns
- **Chapter Progression**: Locked/unlocked chapters based on completion
- **Collapsible UI**: Clean, organized interface

## 🛠️ Setup

### 1. Sarvam AI Integration ✅

**Already configured!** Your Sarvam AI API key is set up and ready to use for:
- **Text-to-Speech**: High-quality voice synthesis
- **Speech-to-Text**: Voice input for speeches
- **AI Evaluation**: Debate coaching and feedback

### 2. Environment Variables (Optional)

The app works perfectly without Supabase! If you want speech history and data persistence, create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: Without Supabase, the app will still work but won't save speech history.

### 3. Deployment to Vercel

1. **Push to GitHub**: 
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy
   - Add environment variables in Vercel dashboard if using Supabase

3. **Environment Variables for Vercel** (Optional):
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
npm run dev
```

## 🎯 How to Use

### AI Evaluation
1. Go to the AI Evaluation page
2. Enter your speech in the text area
3. Click "Evaluate with AI" or use the "Demo Speech" button
4. Listen to feedback using the 🔊 buttons
5. Review speaker scale ratings and fallacy detection

### Speech Features
- **🔊 Listen**: Click to hear AI feedback, scores, or fallacy explanations
- **🔇 Stop**: Stop current speech playback
- **Collapsible Sections**: Click −/+ to show/hide detailed feedback

### Chapter Progression
1. Complete end-of-chapter quizzes
2. Progress automatically unlocks next chapters
3. Track completion on the dashboard

## 🧠 Fallacy Detection

The app detects 6 types of logical fallacies:
- **Ad Hominem**: Attacking the person instead of the argument
- **Appeal to Authority**: Using authority without proper evidence
- **Straw Man**: Misrepresenting an opponent's argument
- **False Dilemma**: Presenting only two options when more exist
- **Hasty Generalization**: Making broad conclusions from limited evidence
- **Slippery Slope**: Assuming extreme consequences from one action

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile
- **Collapsible Sections**: Clean, organized interface
- **Visual Feedback**: Color-coded sections and icons
- **Progress Tracking**: Visual progress bars and completion badges
- **Speech History**: Interactive timeline of past evaluations

## 🔧 Technical Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: Sarvam AI integration (TTS, STT, Chat)
- **State Management**: React Hooks
- **Storage**: LocalStorage for progress, Supabase for speech history

## 📱 Accessibility

- **Text-to-Speech**: All feedback can be read aloud
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML structure
- **High Contrast**: Clear visual hierarchy

## 🚀 Future Enhancements

- Real-time debate practice with AI
- Voice input for speeches
- Advanced fallacy detection with AI
- Debate tournament features
- Social sharing of achievements
- Multi-language support
