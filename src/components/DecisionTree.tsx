import React, { useState } from 'react';
import styles from './DecisionTree.module.css';
// Import the decision tree data from the JSON file
import decisionTreeData from '@site/src/data/decisionTree.json';

// --- TYPE DEFINITIONS ---

interface Option {
  label: string;
  next: string;
  // The breadcrumb_label is now part of the Option type.
  // It's optional to ensure backward compatibility with older data structures.
  breadcrumb_label?: string;
}

interface Node {
  text: string;
  options?: Option[];
}

interface DecisionTreeData {
  [key: string]: Node;
}

interface HistoryCrumb {
  nodeId: string;
  label: string;
}

// --- TYPE ASSERTION FOR IMPORTED DATA ---
const decisionTree: DecisionTreeData = decisionTreeData;

// --- REACT COMPONENT ---

const DecisionTree: React.FC = () => {
  // The initial crumb label is static, as it represents the root.
  const [history, setHistory] = useState<HistoryCrumb[]>([{ nodeId: 'start', label: 'Start' }]);
  const [isFading, setIsFading] = useState<boolean>(false);

  const currentStep = history[history.length - 1];
  const currentNode = decisionTree[currentStep.nodeId];

  const handleOptionClick = (option: Option) => {
    setIsFading(true);
    setTimeout(() => {
      // **UPDATED LOGIC**: Use the breadcrumb_label for the history.
      // Fall back to the main label if breadcrumb_label is not defined.
      const newCrumbLabel = option.breadcrumb_label || option.label;
      setHistory(prevHistory => [...prevHistory, { nodeId: option.next, label: newCrumbLabel }]);
      setIsFading(false);
    }, 300);
  };

  const handleBreadcrumbClick = (index: number) => {
    setIsFading(true);
    setTimeout(() => {
      setHistory(prevHistory => prevHistory.slice(0, index + 1));
      setIsFading(false);
    }, 300);
  };
  
  const restartTree = () => {
    setIsFading(true);
    setTimeout(() => {
        setHistory([{ nodeId: 'start', label: 'Start' }]);
        setIsFading(false);
    }, 300);
  };

  // Helper for keyboard accessibility on divs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbsContainer}>
        {history.map((crumb, index) => {
          const isLast = index === history.length - 1;
          return (
            <React.Fragment key={index}>
              <div
                role="button"
                tabIndex={isLast ? -1 : 0}
                onClick={() => !isLast && handleBreadcrumbClick(index)}
                onKeyDown={(e) => !isLast && handleKeyDown(e, () => handleBreadcrumbClick(index))}
                className={isLast ? styles.crumbActive : styles.crumb}
                aria-disabled={isLast}
              >
                {crumb.label}
              </div>
              {!isLast && <span className={styles.separator}>&gt;</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Content Box */}
      <div className={`${styles.treeContainer} ${isFading ? styles.fadeOut : styles.fadeIn}`}>
        <div className={styles.nodeContent}>
          <p>{currentNode.text}</p>
        </div>

        {currentNode.options ? (
          <div className={styles.optionsContainer}>
            {currentNode.options.map((option, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => handleKeyDown(e, () => handleOptionClick(option))}
                className={styles.optionButton}
              >
                {option.label}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.restartContainer}>
            <div
              role="button"
              tabIndex={0}
              onClick={restartTree}
              onKeyDown={(e) => handleKeyDown(e, restartTree)}
              className={styles.restartButton}
            >
              Start Over
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DecisionTree;
