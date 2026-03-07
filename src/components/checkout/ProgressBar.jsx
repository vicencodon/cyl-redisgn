import { Link } from 'react-router-dom'

const STEPS = [
  { label: 'Carrito',          to: '/carrito' },
  { label: 'Datos y envío',    to: '/checkout' },
  { label: 'Confirmación',     to: null },
]

export default function ProgressBar({ currentStep }) {
  return (
    <nav className="flex items-center justify-center mb-8 gap-0">
      {STEPS.map((step, i) => {
        const done    = i < currentStep
        const active  = i === currentStep
        const isLast  = i === STEPS.length - 1

        const labelClass = active
          ? 'text-brand-700 font-semibold'
          : done
          ? 'text-gray-500'
          : 'text-gray-300'

        const circleClass = active
          ? 'bg-brand-600 border-brand-600 text-white'
          : done
          ? 'bg-brand-100 border-brand-300 text-brand-600'
          : 'bg-white border-gray-200 text-gray-300'

        const inner = done ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-xs font-medium">{i + 1}</span>
        )

        const content = (
          <div className="flex flex-col items-center gap-1.5">
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${circleClass}`}>
              {inner}
            </span>
            <span className={`text-xs whitespace-nowrap ${labelClass}`}>{step.label}</span>
          </div>
        )

        return (
          <div key={step.label} className="flex items-start">
            <div className="flex flex-col items-center">
              {done && step.to ? <Link to={step.to}>{content}</Link> : content}
            </div>
            {!isLast && (
              <div className={`w-16 sm:w-24 h-0.5 mt-3.5 mx-1 ${done ? 'bg-brand-300' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </nav>
  )
}
