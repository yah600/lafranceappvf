import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CreditCard, Download, Star, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useInvoicesStore } from '@stores/invoicesStore'
import { useJobsStore } from '@stores/jobsStore'
import { useUIStore } from '@stores/uiStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import { formatCurrency, formatDate } from '@utils/formatters'
import { getDivisionName } from '@config/divisions'
import './ClientPayment.css'

function ClientPayment() {
  const { id } = useParams() // invoice ID
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const invoices = useInvoicesStore((state) => state.invoices)
  const updateInvoice = useInvoicesStore((state) => state.updateInvoice)
  const jobs = useJobsStore((state) => state.jobs)
  const showToast = useUIStore((state) => state.showToast)

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)

  const invoice = invoices.find((inv) => inv.id === id)
  const job = invoice ? jobs.find((j) => j.id === invoice.jobId) : null
  const hasRated = job && job.rating > 0

  useEffect(() => {
    if (!invoice) {
      showToast('Facture non trouvée', 'error')
      navigate('/client/invoices')
    }
  }, [invoice, navigate, showToast])

  const handlePayment = async () => {
    if (!hasRated) {
      showToast('Veuillez évaluer le service avant de payer', 'warning')
      navigate(`/client/job/${job.id}/rating`)
      return
    }

    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update invoice status
      updateInvoice(id, {
        status: 'paid',
        paidDate: new Date().toISOString(),
        paymentMethod,
      })

      showToast('Paiement effectué avec succès!', 'success')

      // Show download option
      setTimeout(() => {
        navigate('/client/invoices')
      }, 1500)
    } catch (error) {
      console.error('Payment error:', error)
      showToast('Erreur lors du paiement', 'error')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownloadInvoice = () => {
    if (!hasRated) {
      showToast('Veuillez évaluer le service avant de télécharger', 'warning')
      navigate(`/client/job/${job.id}/rating`)
      return
    }

    if (invoice.status !== 'paid') {
      showToast('Veuillez payer la facture avant de télécharger', 'warning')
      return
    }

    // Generate PDF download
    showToast('Téléchargement de la facture...', 'success')
    // In real app: download PDF
  }

  if (!invoice || !job) {
    return (
      <AppLayout title="Paiement" showHeader={true} showBackButton={true}>
        <div className="error-state">
          <p>Facture non trouvée</p>
        </div>
      </AppLayout>
    )
  }

  const isPaid = invoice.status === 'paid'

  return (
    <AppLayout
      pageTitle="Paiement"
      pageDescription={`Facture ${invoice.id.toUpperCase()}`}
      showHeader={true}
      showBackButton={true}
    >
      <div className="client-payment">
        {/* Rating Warning */}
        {!hasRated && (
          <div className="rating-warning-banner">
            <AlertCircle size={24} />
            <div className="warning-content">
              <h3>Évaluation Requise</h3>
              <p>Vous devez évaluer le service avant de payer ou télécharger votre facture</p>
            </div>
            <button
              className="btn btn-warning"
              onClick={() => navigate(`/client/job/${job.id}/rating`)}
            >
              Évaluer Maintenant
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Payment Success Banner */}
        {isPaid && (
          <div className="payment-success-banner">
            <CheckCircle size={24} />
            <div className="success-content">
              <h3>Paiement Effectué</h3>
              <p>Payée le {formatDate(invoice.paidDate)}</p>
            </div>
          </div>
        )}

        {/* Invoice Details */}
        <Section title="Détails de la Facture">
          <div className="invoice-details">
            <div className="invoice-header-info">
              <div className="invoice-meta">
                <div className="meta-item">
                  <span className="meta-label">Numéro:</span>
                  <span className="meta-value">{invoice.id.toUpperCase()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Date:</span>
                  <span className="meta-value">{formatDate(invoice.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Division:</span>
                  <span className="meta-value">{getDivisionName(invoice.division)}</span>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="invoice-items-section">
              <h4 className="section-subtitle">Services</h4>
              <div className="items-table">
                {invoice.items && invoice.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-description">
                      <div className="item-name">{item.description}</div>
                      {item.quantity > 1 && (
                        <div className="item-details">
                          Quantité: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </div>
                      )}
                    </div>
                    <div className="item-amount">{formatCurrency(item.amount)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="invoice-totals">
              <div className="total-row">
                <span className="total-label">Sous-total</span>
                <span className="total-value">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">TPS (5%)</span>
                <span className="total-value">{formatCurrency(invoice.gst)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">TVQ (9.975%)</span>
                <span className="total-value">{formatCurrency(invoice.qst)}</span>
              </div>
              <div className="total-row total-final">
                <span className="total-label">Total</span>
                <span className="total-value">{formatCurrency(invoice.total)}</span>
              </div>
            </div>

            {invoice.notes && (
              <div className="invoice-notes">
                <strong>Notes:</strong> {invoice.notes}
              </div>
            )}
          </div>
        </Section>

        {/* Payment Method (only if not paid) */}
        {!isPaid && hasRated && (
          <Section title="Méthode de Paiement">
            <div className="payment-methods">
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-method-content">
                  <CreditCard size={24} />
                  <div>
                    <div className="payment-method-name">Carte de crédit</div>
                    <div className="payment-method-desc">Visa, Mastercard, Amex</div>
                  </div>
                </div>
              </label>

              <label className="payment-method-option">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-method-content">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                  <div>
                    <div className="payment-method-name">Virement bancaire</div>
                    <div className="payment-method-desc">Transfert Interac</div>
                  </div>
                </div>
              </label>
            </div>
          </Section>
        )}

        {/* Job Rating Display */}
        {hasRated && (
          <Section title="Votre Évaluation">
            <div className="rating-display">
              <div className="stars-display">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={24}
                    fill={value <= job.rating ? '#FFD700' : 'none'}
                    stroke={value <= job.rating ? '#FFD700' : '#C7C7CC'}
                  />
                ))}
              </div>
              {job.ratingComment && (
                <div className="rating-comment">"{job.ratingComment}"</div>
              )}
            </div>
          </Section>
        )}

        {/* Action Buttons */}
        <div className="payment-actions">
          {!isPaid && hasRated && (
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handlePayment}
              disabled={processing}
            >
              <CreditCard size={20} />
              {processing ? 'Traitement...' : `Payer ${formatCurrency(invoice.total)}`}
            </button>
          )}

          {isPaid && (
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleDownloadInvoice}
            >
              <Download size={20} />
              Télécharger la Facture PDF
            </button>
          )}

          <button
            className="btn btn-outline btn-lg btn-full"
            onClick={() => navigate('/client/invoices')}
          >
            Retour aux Factures
          </button>
        </div>
      </div>
    </AppLayout>
  )
}

export default ClientPayment
