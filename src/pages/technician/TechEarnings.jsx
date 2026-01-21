import { useState } from 'react'
import { DollarSign, TrendingUp, Clock, Download } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import { formatCurrency, formatDate } from '@utils/formatters'
import './TechEarnings.css'

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
    <AppLayout title="Mes Revenus" showHeader={true} showMobileNav={true}>
      {/* Available Balance Card */}
      <Section>
        <Card className="balance-card">
          <div className="balance-content">
            <div className="balance-label">Solde Disponible</div>
            <div className="balance-amount">{formatCurrency(earnings.available)}</div>
            <Button
              size="large"
              variant="success"
              onClick={handleWithdraw}
              icon={<Download size={20} />}
              className="withdraw-button"
            >
              Retrait
            </Button>
          </div>
        </Card>
      </Section>

      {/* Pending Balance */}
      <Section>
        <Card className="pending-card">
          <div className="pending-content">
            <div className="pending-info">
              <div className="pending-label">En Attente (25%)</div>
              <div className="pending-amount">
                {formatCurrency(earnings.pending)}
              </div>
              <div className="pending-note">
                Libération dans 3-7 jours
              </div>
            </div>
            <Clock size={48} className="pending-icon" />
          </div>
        </Card>
      </Section>

      {/* Stats Grid */}
      <Section>
        <div className="stats-grid">
          <Card className="stat-card">
            <DollarSign size={32} className="stat-icon stat-icon-green" />
            <div className="stat-value">{formatCurrency(earnings.thisMonth, false)}</div>
            <div className="stat-label">Ce mois-ci</div>
            <div className="stat-growth">
              +{monthlyGrowth}% vs dernier mois
            </div>
          </Card>

          <Card className="stat-card">
            <TrendingUp size={32} className="stat-icon stat-icon-blue" />
            <div className="stat-value">{formatCurrency(earnings.avgPerJob, false)}</div>
            <div className="stat-label">Moyen/job</div>
            <div className="stat-meta">
              {user?.completedJobs || 0} jobs complétés
            </div>
          </Card>
        </div>
      </Section>

      {/* Payment History */}
      <Section title="Historique des Paiements">
        <div className="payment-history">
          {paymentHistory.map((payment) => (
            <Card key={payment.id} className="payment-card">
              <div className="payment-header">
                <div>
                  <div className="payment-service">{payment.service}</div>
                  <div className="payment-date">{formatDate(payment.date)}</div>
                </div>
                <div className="payment-total">
                  {formatCurrency(payment.immediate + payment.holdback)}
                </div>
              </div>
              <div className="payment-details">
                <div className="payment-row">
                  <span className="payment-status-released">✅ Immédiat (75%)</span>
                  <span className="payment-amount">{formatCurrency(payment.immediate)}</span>
                </div>
                <div className="payment-row">
                  <span className={payment.holdbackReleased ? 'payment-status-released' : 'payment-status-pending'}>
                    {payment.holdbackReleased ? '✅' : '⏳'} Retenu (25%)
                  </span>
                  <span className="payment-amount">{formatCurrency(payment.holdback)}</span>
                </div>
                {!payment.holdbackReleased && payment.releaseIn && (
                  <div className="payment-note">
                    Disponible dans {payment.releaseIn} jours
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Statistics */}
      <Section title="Statistiques">
        <Card>
          <div className="statistics">
            <div className="stat-row">
              <span className="stat-row-label">Jobs ce mois:</span>
              <span className="stat-row-value">23</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Revenu moyen/job:</span>
              <span className="stat-row-value">{formatCurrency(earnings.avgPerJob)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Meilleur mois:</span>
              <span className="stat-row-value">{formatCurrency(15230)} (Déc)</span>
            </div>
            <div className="stat-row">
              <span className="stat-row-label">Total année:</span>
              <span className="stat-row-value stat-row-highlight">{formatCurrency(95400)}</span>
            </div>
          </div>
        </Card>
      </Section>
    </AppLayout>
  )
}

export default TechEarnings
