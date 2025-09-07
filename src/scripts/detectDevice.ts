export const detectDevice = (): 'mobile' | 'tablet' | 'computer' => {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/mobile/i.test(userAgent)) {
    return 'mobile'
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet'
  } else {
    return 'computer'
  }
}
