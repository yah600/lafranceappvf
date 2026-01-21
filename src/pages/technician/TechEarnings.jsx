import { useState } from 'react'
import { Page, Navbar, Block, Card, Button, List, ListItem } from 'konsta/react'
import { DollarSign, TrendingUp, Clock, Download } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import MobileBottomNav from '@components/layout/MobileBottomNav'
import { formatCurrency, formatDate } from '@utils/formatters'

function TechEarnings() {
  const user = useAuthStore((state) => state.user)

  // Mock earnings data
  const earnings = {
    available: 8450.00,
    pending: 1125.50,
    thisMonth: 12450.00,
    lastMonth: 10500.00,
    avgPerJob: 542.00,
  }

  const paymentHistory = [
    {
      id: 'pay-1',
      jobId: 'job-004',
      date: '2026-01-20',
      service: 'Réparation robinet',
      immediate: 90.00,
      holdback: 30.00,
      holdbackReleased: true,
    },
    {
      id: 'pay-2',
      jobId: 'job-003',
      date: '2026-01-21',
      service: 'Installation chauffe-eau',
      immediate: 600.00,
      holdback: 200.00,
      holdbackReleased: false,
      releaseIn: 3,
    },
  ]

  const handleWithdraw = () => {
    alert(`Retrait de ${formatCurrency(earnings.available)} en traitement.\n\nFonds disponibles dans 1-3 jours ouvrables.`)
  }

  const monthlyGrowth = ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth * 100).toFixed(1)

  return (
    <Page>
      <Navbar title="Mes Revenus" />

      <div className="pb-20">
        {/* Available Balance Card */}
        <Block>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-center py-4">
              <div className="text-sm font-medium mb-2">Solde Disponible</div>
              <div className="text-4xl font-bold mb-4">{formatCurrency(earnings.available)}</div>
              <Button
                large
                onClick={handleWithdraw}
                className="bg-white text-green-600 font-semibold"
              >
                <Download size={20} className="mr-2" />
                Retrait
              </Button>
            </div>
          </Card>
        </Block>

        {/* Pending Balance */}
        <Block>
          <Card className="bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-700 font-medium">En Attente (25%)</div>
                <div className="text-2xl font-bold text-orange-900">
                  {formatCurrency(earnings.pending)}
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Libération dans 3-7 jours
                </div>
              </div>
              <Clock size={48} className="text-orange-300" />
            </div>
          </Card>
        </Block>

        {/* Stats Grid */}
        <Block>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <DollarSign size={32} className="mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{formatCurrency(earnings.thisMonth, false)}</div>
              <div className="text-sm text-gray-600">Ce mois-ci</div>
              <div className="text-xs text-green-600 font-semibold mt-1">
                +{monthlyGrowth}% vs dernier mois
              </div>
            </Card>

            <Card className="text-center">
              <TrendingUp size={32} className="mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{formatCurrency(earnings.avgPerJob, false)}</div>
              <div className="text-sm text-gray-600">Moyen/job</div>
              <div className="text-xs text-gray-500 mt-1">
                {user?.completedJobs || 0} jobs complétés
              </div>
            </Card>
          </div>
        </Block>

        {/* Payment History */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Historique des Paiements</h2>
          <List strong inset>
            {paymentHistory.map((payment) => (
              <ListItem
                key={payment.id}
                title={payment.service}
                after={formatCurrency(payment.immediate + payment.holdback)}
              >
                <div className="text-xs text-gray-600">
                  {formatDate(payment.date)}
                </div>
                <div className="text-xs mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-green-700">✅ Immédiat (75%)</span>
                    <span className="font-semibold">{formatCurrency(payment.immediate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={payment.holdbackReleased ? 'text-green-700' : 'text-orange-700'}>
                      {payment.holdbackReleased ? '✅' : '⏳'} Retenu (25%)
                    </span>
                    <span className="font-semibold">{formatCurrency(payment.holdback)}</span>
                  </div>
                  {!payment.holdbackReleased && payment.releaseIn && (
                    <div className="text-xs text-orange-600 italic">
                      Disponible dans {payment.releaseIn} jours
                    </div>
                  )}
                </div>
              </ListItem>
            ))}
          </List>
        </Block>

        {/* Statistics */}
        <Block>
          <h2 className="text-xl font-bold mb-3">Statistiques</h2>
          <Card>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Jobs ce mois:</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenu moyen/job:</span>
                <span className="font-semibold">{formatCurrency(earnings.avgPerJob)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Meilleur mois:</span>
                <span className="font-semibold">{formatCurrency(15230)} (Déc)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total année:</span>
                <span className="font-semibold text-green-600">{formatCurrency(95400)}</span>
              </div>
            </div>
          </Card>
        </Block>
      </div>

      <MobileBottomNav />
    </Page>
  )
}

export default TechEarnings
