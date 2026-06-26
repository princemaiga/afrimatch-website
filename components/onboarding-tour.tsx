'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to AfriMatch! 👋',
    description: 'Let\'s take a quick tour to help you get started. This tour will show you all the amazing features available.',
    position: 'bottom',
  },
  {
    id: 'community-mode',
    title: 'Community Mode',
    description: 'Discover people across Africa and the diaspora who share your interests, culture, and values. Connect, chat, and build your community.',
    target: 'community-section',
    position: 'bottom',
  },
  {
    id: 'professional-mode',
    title: 'Professional Networking',
    description: 'Find job opportunities, connect with mentors, and take courses to advance your career. Switch between modes anytime!',
    target: 'professional-section',
    position: 'bottom',
  },
  {
    id: 'messaging',
    title: 'Real-Time Messaging',
    description: 'Chat with your community and professional connections in real-time. Share updates, send reactions, and stay connected!',
    target: 'messaging-section',
    position: 'left',
  },
  {
    id: 'premium',
    title: 'Premium Features',
    description: 'Unlock Professional Premium features: unlimited job applications, certified courses, 1-on-1 mentorship, and career analytics. Choose the plan that works for you!',
    target: 'premium-section',
    position: 'bottom',
  },
  {
    id: 'referral',
    title: 'Earn Rewards',
    description: 'Invite friends and earn rewards! Get commissions on referrals and unlock exclusive perks.',
    target: 'referral-section',
    position: 'top',
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🎉',
    description: 'You\'re ready to explore AfriMatch. Start by completing your profile to connect with your community and unlock career opportunities!',
    position: 'bottom',
  },
];

interface OnboardingTourProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoStart?: boolean;
}

export function OnboardingTour({ isOpen = false, onClose, autoStart = true }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [hasCompleted, setHasCompleted] = useState(false);

  const step = TOUR_STEPS[currentStep];

  useEffect(() => {
    if (autoStart && !localStorage.getItem('onboarding_completed')) {
      setIsVisible(true);
    }
  }, [autoStart]);

  useEffect(() => {
    if (step.target) {
      const element = document.getElementById(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 10,
          left: rect.left,
        });
      }
    }
  }, [currentStep, step.target]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setHasCompleted(true);
    localStorage.setItem('onboarding_completed', 'true');
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 1500);
  };

  const handleSkip = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Spotlight */}
      {step.target && (
        <div
          className="fixed z-40 pointer-events-none"
          style={{
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`,
            borderRadius: '8px',
          }}
        >
          <div
            id={`spotlight-${step.target}`}
            className="absolute"
            style={{
              top: position.top - 10,
              left: position.left - 10,
            }}
          />
        </div>
      )}

      {/* Tour Card */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl max-w-sm p-6 border border-slate-200"
        style={{
          top: step.target ? `${position.top}px` : '50%',
          left: step.target ? `${position.left}px` : '50%',
          transform: step.target ? 'none' : 'translate(-50%, -50%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Completion State */}
        {hasCompleted ? (
          <div className="text-center py-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tour Complete!</h3>
            <p className="text-slate-600 mb-4">You're ready to explore AfriMatch</p>
          </div>
        ) : (
          <>
            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>

            {/* Description */}
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{step.description}</p>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex gap-1">
                {TOUR_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Step {currentStep + 1} of {TOUR_STEPS.length}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === 0}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Skip Link */}
            <button
              onClick={handleSkip}
              className="w-full mt-3 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip Tour
            </button>
          </>
        )}
      </div>
    </>
  );
}

export function useOnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);

  const start = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, start, close };
}
