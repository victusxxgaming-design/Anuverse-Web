interface Props { visible: boolean }

export default function LoadingScreen({ visible }: Props) {
  return (
    <div className={`loading-screen${visible ? '' : ' hidden'}`}>
      <div className="loader-logo-ring">
        <img src="/images/logo.png" alt="Anuverse" />
      </div>
      <div className="loader-brand">Anuverse</div>
      <div className="loader-bar" />
    </div>
  )
}
