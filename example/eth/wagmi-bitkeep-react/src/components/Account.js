import { useAccount, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { data } = useEnsName({ address })

  return (
    <div>
      {data ?? address}
      {data ? ` (${address})` : null}
    </div>
  )
}