import { useTranslation } from "react-i18next"

import { useWhoami } from "~/atoms/user"
import { Logo } from "~/components/icons/logo"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MotionButtonBase } from "~/components/ui/button"
import { RelativeTime } from "~/components/ui/datetime"
import { LoadingCircle } from "~/components/ui/loading"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { cn } from "~/lib/utils"
import { usePresentUserProfileModal } from "~/modules/profile/hooks"
import { SettingSectionTitle } from "~/modules/settings/section"
import { Balance } from "~/modules/wallet/balance"
import { useWallet, useWalletTransactions } from "~/queries/wallet"

export const TransactionsSection: Component = ({ className }) => {
  const { t } = useTranslation("settings")
  const user = useWhoami()
  const wallet = useWallet()
  const myWallet = wallet.data?.[0]

  const transactions = useWalletTransactions({ fromOrToUserId: user?.id })

  if (!myWallet) return null

  if (transactions.isLoading) {
    return (
      <div className={cn("center mt-12", className)}>
        <LoadingCircle size="large" />
      </div>
    )
  }

  return (
    <div className="relative flex min-w-0 grow flex-col">
      <SettingSectionTitle title={t("wallet.transactions.title")} />

      <div className={cn("w-fit min-w-0 grow overflow-x-auto", className)}>
        <Table className="w-full table-fixed">
          <TableHeader className="sticky top-0 z-10 bg-theme-background">
            <TableRow className="[&_*]:!pl-0 [&_*]:!font-semibold">
              <TableHead>{t("wallet.transactions.type")}</TableHead>
              <TableHead>{t("wallet.transactions.amount")}</TableHead>
              <TableHead>{t("wallet.transactions.from")}</TableHead>
              <TableHead>{t("wallet.transactions.to")}</TableHead>
              <TableHead>{t("wallet.transactions.date")}</TableHead>
              <TableHead>{t("wallet.transactions.tx")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.data?.map((row) => (
              <TableRow key={row.hash}>
                <TableCell align="left" size="sm">
                  <TypeRenderer type={row.type} />
                </TableCell>
                <TableCell align="left" size="sm">
                  <BalanceRenderer
                    sign={row.fromUserId === user?.id ? "-" : "+"}
                    amount={row.powerToken}
                  />
                </TableCell>
                <TableCell align="left" size="sm">
                  <UserRenderer user={row.fromUser} />
                </TableCell>
                <TableCell align="left" size="sm">
                  <UserRenderer user={row.toUser} />
                </TableCell>

                <TableCell align="left" size="sm">
                  <EllipsisHorizontalTextWithTooltip>
                    <RelativeTime date={row.createdAt} dateFormatTemplate="l" />
                  </EllipsisHorizontalTextWithTooltip>
                </TableCell>
                <TableCell align="left" size="sm">
                  <Tooltip>
                    <TooltipTrigger>
                      <a target="_blank" href={`https://scan.rss3.io/tx/${row.hash}`}>
                        {row.hash.slice(0, 10)}...
                      </a>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent>{row.hash}</TooltipContent>
                    </TooltipPortal>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!transactions.data?.length && (
        <div className="my-2 w-full text-center text-sm text-zinc-400">
          {t("wallet.transactions.noTransactions")}
        </div>
      )}
    </div>
  )
}

const TypeRenderer = ({
  type,
}: {
  type: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["type"]
}) => {
  const { t } = useTranslation("settings")
  return <div className="uppercase">{t(`wallet.transactions.types.${type}`)}</div>
}

const BalanceRenderer = ({
  sign,
  amount,
}: {
  sign: "+" | "-"
  amount: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number]["powerToken"]
}) => (
  <div
    className={cn("flex items-center", {
      "text-green-500": sign === "+",
      "text-red-500": sign === "-",
    })}
  >
    {sign}
    <Balance>{amount}</Balance>
  </div>
)

const UserRenderer = ({
  user,
}: {
  user?: NonNullable<ReturnType<typeof useWalletTransactions>["data"]>[number][
    | "fromUser"
    | "toUser"]
}) => {
  const { t } = useTranslation("settings")
  const me = useWhoami()
  const isMe = user?.id === me?.id

  const name = isMe ? t("wallet.transactions.you") : user?.name || APP_NAME

  const presentUserModal = usePresentUserProfileModal("drawer")
  return (
    <MotionButtonBase
      onClick={() => {
        if (user?.id) presentUserModal(user.id)
      }}
      className="flex w-full min-w-0 cursor-button items-center"
    >
      {name === APP_NAME ? (
        <Logo className="aspect-square size-4" />
      ) : (
        <Avatar className="aspect-square size-4 duration-200 animate-in fade-in-0">
          <AvatarImage src={replaceImgUrlIfNeed(user?.image || undefined)} />
          <AvatarFallback>{name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      )}

      <div className="ml-1 w-0 grow truncate">
        <EllipsisHorizontalTextWithTooltip className="text-left">
          {isMe ? (
            <span className="font-bold">{t("wallet.transactions.you")}</span>
          ) : (
            <span>{name}</span>
          )}
        </EllipsisHorizontalTextWithTooltip>
      </div>
    </MotionButtonBase>
  )
}
