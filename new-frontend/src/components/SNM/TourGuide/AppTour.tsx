// import Joyride, { CallBackProps, STATUS } from "react-joyride";
// import { useEffect, useState } from "react";
// import { dashboardTourSteps } from "./tourSteps";

// export default function AppTour() {
//   const [run, setRun] = useState(false);
//   const [ready, setReady] = useState(false);

//   // Wait for dashboard to fully render
//   useEffect(() => {
//     const timer = setTimeout(() => setReady(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const completed = localStorage.getItem("dashboardTourCompleted");
//     if (!completed && ready) {
//       setRun(true);
//     }
//   }, [ready]);

//   const handleCallback = (data: CallBackProps) => {
//     if (
//       data.status === STATUS.FINISHED ||
//       data.status === STATUS.SKIPPED
//     ) {
//       localStorage.setItem("dashboardTourCompleted", "true");
//       setRun(false);
//     }
//   };

//   return (
//     <Joyride
//       steps={dashboardTourSteps}
//       run={run}
//       continuous
//       showSkipButton
//       showProgress
//       scrollToFirstStep
//       disableOverlayClose
//       callback={handleCallback}
//       styles={{
//         options: {
//           primaryColor: "#6366f1",
//           backgroundColor: "#ffffff",
//           textColor: "#0f172a",
//           overlayColor: "rgba(0,0,0,0.65)",
//           arrowColor: "#ffffff",
//           zIndex: 10000,
//         },
//         tooltip: {
//           borderRadius: 14,
//           padding: 16,
//           boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
//         },
//         buttonNext: {
//           backgroundColor: "#6366f1",
//         },
//         buttonBack: {
//           color: "#6366f1",
//         },
//       }}
//       locale={{
//         back: "Back",
//         close: "Close",
//         last: "Finish",
//         next: "Next",
//         skip: "Skip Tour",
//       }}
//     />
//   );
// }










import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { useEffect, useState } from "react";
import { Sparkles, Heart, Zap } from "lucide-react";
import { dashboardTourSteps } from "./tourSteps";



const CustomTooltip = ({
  index,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: any) => {
  const isFirstStep = index === 0;

  return (
    <div
      {...tooltipProps}
      className="relative bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-w-md"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full" />
      
      <div className="relative p-6">
        {/* Welcome Animation for First Step */}
        {isFirstStep && (
          <div className="mb-6 flex flex-col items-center">
            <div className="relative">
              {/* Animated namaste person */}
              <div className="text-7xl animate-bounce mb-2">🙏</div>
              
              {/* Floating sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-500 animate-spin" />
              <Sparkles className="absolute -top-2 -left-2 w-4 h-4 text-pink-500 animate-pulse" />
              <Heart className="absolute -bottom-1 right-0 w-4 h-4 text-red-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 animate-fade-in">
              Welcome! 🎉
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Let's take a quick tour of your dashboard
            </p>
          </div>
        )}

        {/* Step indicator with animation */}
        {!isFirstStep && (
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Step {index + 1}
            </span>
          </div>
        )}

        {/* Title */}
        {step.title && !isFirstStep && (
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {step.title}
          </h3>
        )}

        {/* Content */}
        <div className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
          {step.content}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            {...skipProps}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            Skip Tour
          </button>

          <div className="flex gap-2">
            {index > 0 && (
              <button
                {...backProps}
                className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-all hover:scale-105"
              >
                Back
              </button>
            )}
            
            <button
              {...primaryProps}
              className="px-6 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2"
            >
              {isLastStep ? (
                <>
                  Finish 🎊
                </>
              ) : (
                <>
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />
    </div>
  );
};

export default function AppTour() {
  const [run, setRun] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const completed = localStorage.getItem("dashboardTourCompleted");
    if (!completed && ready) {
      setRun(true);
    }
  }, [ready]);

  const handleCallback = (data: CallBackProps) => {
    if (
      data.status === STATUS.FINISHED ||
      data.status === STATUS.SKIPPED
    ) {
      localStorage.setItem("dashboardTourCompleted", "true");
      setRun(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .react-joyride__spotlight {
          border-radius: 12px !important;
        }
      `}</style>

      <Joyride
        steps={dashboardTourSteps}
        run={run}
        continuous
        showSkipButton
        showProgress
        scrollToFirstStep
        disableOverlayClose
        callback={handleCallback}
        tooltipComponent={CustomTooltip}
        styles={{
          options: {
            overlayColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 10000,
          },
          spotlight: {
            borderRadius: 12,
          },
        }}
        floaterProps={{
          disableAnimation: false,
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          skip: "Skip Tour",
        }}
      />
    </>
  );
}