import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useInvoicesStore } from '@stores/invoicesStore'
import { useJobsStore } from '@stores/jobsStore'
import AppLayout from '@components/layout/AppLayout'
import Section from '@components/common/Section'
import { formatCurrency, formatDate } from '@utils/formatters'
import { getDivisionName } from '@config/divisions'
import './ClientInvoices.css'

function ClientInvoices() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const invoices = useInvoicesStore((state) => state.invoices)
  const setInvoices = useInvoicesStore((state) => state.setInvoices)
  const jobs = useJobsStore((state) => state.jobs)

  // Initialize invoices if needed
  useEffect(() => {
    // In real app, fetch invoices from API
    if (invoices.length === 0) {
      // Mock invoices would be loaded here
    }
  }, [invoices.length, setInvoices])

  // Get invoices for current client
  const myInvoices = invoices.filter((inv) => inv.clientId === user?.id)
  const pendingInvoices = myInvoices.filter((inv) => inv.status === 'pending')
  const paidInvoices = myInvoices.filter((inv) => inv.status === 'paid')

  // Check if job has been rated
  const hasJobBeenRated = (jobId) => {
    const job = jobs.find((j) => j.id === jobId)
    return job && job.rating > 0
  }

  const handleInvoiceClick = (invoice) => {
    navigate(`/client/invoice/${invoice.id}/payment`)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={20} className="status-icon-success" />
      case 'pending':
        return <Clock size={20} className="status-icon-warning" />
      case 'overdue':
        return <AlertCircle size={20} className="status-icon-error" />
      default:
        return null
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid':
        return 'Payée'
      case 'pending':
        return 'En attente'
      case 'overdue':
        return 'En retard'
      default:
        return status
    }
  }

  return (
    <AppLayout
      pageTitle="Mes Factures"
      pageDescription="Consultez et payez vos factures"
      breadcrumbs={['Client', 'Factures']}
      showHeader={true}
      showMobileNav={true}
    >
      <div className="client-invoices">
        {/* Summary Cards */}
        <div className="invoice-summary">
          <div className="summary-card pending-card">
            <div className="summary-icon">
              <Clock size={24} />
            </div>
            <div className="summary-info">
              <div className="summary-value">{formatCurrency(
                pendingInvoices.reduce((sum, inv) => sum + inv.total, 0)
              )}</div>
              <div className="summary-label">En attente ({pendingInvoices.length})</div>
            </div>
          </div>
          <div className="summary-card paid-card">
            <div className="summary-icon">
              <CheckCircle size={24} />
            </div>
            <div className="summary-info">
              <div className="summary-value">{formatCurrency(
                paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
              )}</div>
              <div className="summary-label">Payées ({paidInvoices.length})</div>
            </div>
          </div>
        </div>

        {/* Pending Invoices */}
        {pendingInvoices.length > 0 && (
          <Section title="Factures en Attente">
            <div className="invoices-list">
              {pendingInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="invoice-card pending"
                  onClick={() => handleInvoiceClick(invoice)}
                >
                  <div className="invoice-header">
                    <div className="invoice-number">
                      <FileText size={20} />
                      <span>{invoice.id.toUpperCase()}</span>
                    </div>
                    <div className="invoice-status">
                      {getStatusIcon(invoice.status)}
                      <span>{getStatusLabel(invoice.status)}</span>
                    </div>
                  </div>

                  <div className="invoice-body">
                    <div className="invoice-division">
                      {getDivisionName(invoice.division)}
                    </div>
                    <div className="invoice-items">
                      {invoice.items && invoice.items.length > 0 && (
                        <div className="invoice-main-item">
                          {invoice.items[0].description}
                        </div>
                      )}
                      {invoice.items && invoice.items.length > 1 && (
                        <div className="invoice-more-items">
                          +{invoice.items.length - 1} autres service(s)
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="invoice-footer">
                    <div className="invoice-date">
                      Échéance: {formatDate(invoice.dueDate)}
                    </div>
                    <div className="invoice-amount">
                      {formatCurrency(invoice.total)}
                    </div>
                  </div>

                  {!hasJobBeenRated(invoice.jobId) && (
                    <div className="invoice-rating-required">
                      ⚠️ Évaluation requise pour télécharger
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Paid Invoices */}
        {paidInvoices.length > 0 && (
          <Section title="Factures Payées">
            <div className="invoices-list">
              {paidInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="invoice-card paid"
                  onClick={() => handleInvoiceClick(invoice)}
                >
                  <div className="invoice-header">
                    <div className="invoice-number">
                      <FileText size={20} />
                      <span>{invoice.id.toUpperCase()}</span>
                    </div>
                    <div className="invoice-status">
                      {getStatusIcon(invoice.status)}
                      <span>{getStatusLabel(invoice.status)}</span>
                    </div>
                  </div>

                  <div className="invoice-body">
                    <div className="invoice-division">
                      {getDivisionName(invoice.division)}
                    </div>
                    <div className="invoice-items">
                      {invoice.items && invoice.items.length > 0 && (
                        <div className="invoice-main-item">
                          {invoice.items[0].description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="invoice-footer">
                    <div className="invoice-date">
                      Payée le: {formatDate(invoice.paidDate)}
                    </div>
                    <div className="invoice-amount">
                      {formatCurrency(invoice.total)}
                    </div>
                  </div>

                  <button
                    className="btn-download"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Download PDF
                      alert('Téléchargement de la facture PDF...')
                    }}
                  >
                    <Download size={18} />
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Empty State */}
        {myInvoices.length === 0 && (
          <div className="empty-state">
            <FileText size={64} className="empty-icon" />
            <h3 className="empty-title">Aucune Facture</h3>
            <p className="empty-message">
              Vos factures apparaîtront ici après la complétion de vos travaux
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default ClientInvoices
