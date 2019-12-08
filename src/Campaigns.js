import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Toast from 'react-bootstrap/Toast';
import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';
import styles from './Campaigns.module.css';
import Campaign from './Campaign';
import Button from 'react-bootstrap/Button';

function Campaigns() {
	const [campaigns, setCampaigns] = useState({});
	const [campaignID, setCampaignID] = useState(null);
	const [error, setError] = useState(null);
	const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		fetch("http://127.0.0.1:3000/campaigns?userId=1").then(res => {
			setCampaigns(res);
		}).catch(err => {
			setError(err);
			setShowToast(true);
		});
	}, [campaigns]);
  

	const toggleCampaign = id => {
		return () => {
			if (campaignID != null && campaignID === id) {
				setCampaignID(null);
			}
			else {
				setCampaignID(id);
			}
		};
	};
  
	const enroll = id => {
		return () => {

		};
	};
  
	return (
		<div className={styles.page}>
			{
				error && (
					<Toast onClose={() => setShowToast(false)} show={showToast} delay={10000} autohide>
						<Toast.Header>
							<strong style={ {color: "red"} }>Error</strong>
							<small style={ {color: "red"} }>{error.code}</small>
						</Toast.Header>
						<Toast.Body style={ {color: "red"} }>{error.message}</Toast.Body>
					</Toast>
				)
			}
			{
				campaigns.enrolled && campaigns.enrolled.map(campaign => {
					return (
						<Card key={campaign.id} onClick={toggleCampaign(campaign.id)} className={styles.campaignCard}>
							<Card.Body>
								<Campaign data={campaign} showDetails={campaignID === campaign.id} />
								<ProgressBar label={`${campaign.complete}/${campaign.count}`} now={(campaign.complete / campaign.count) * 100} />
							</Card.Body>
						</Card>
					);
				})
			}
			{
				campaigns.unenrolled && campaigns.unenrolled.map(campaign => {
					return (
						<Card key={campaign.id} onClick={toggleCampaign(campaign.id)} className={styles.campaignCard}>
							<Card.Body>
								<Campaign data={campaign} showDetails={campaignID === campaign.id} />
								<Button type="button" variant="primary" size="md" onEnroll={enroll(campaign.id)}>Join the Campaign Now!</Button>
							</Card.Body>
						</Card>
					);
				})
			}
			{
				campaigns.completed && campaigns.completed.map(campaign => {
					return (
						<Card key={campaign.id} className={clsx(styles.campaignCard, styles.campaignCardDisabled)}>
							<Card.Body>
								<Campaign data={campaign} showDetails={false} />
								<Button disabled type="button" variant="secondary" size="md" onEnroll={enroll(campaign.id)}>Completed!</Button>
							</Card.Body>
						</Card>
					);
				})
			}
		</div>
	);
}

export default Campaigns;